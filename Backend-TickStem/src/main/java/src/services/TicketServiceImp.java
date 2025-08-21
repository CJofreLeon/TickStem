package src.services;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import src.config.CustomUserDetails;
import src.dto.RespuestaRequest;
import src.entities.Ticket;
import src.entities.Usuario;
import src.enums.EstadoTicket;
import src.enums.PrioridadTicket;
import src.repositories.TicketRepository;

import java.time.LocalDate;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class TicketServiceImp implements TicketService {

    private final TicketRepository ticketRepository;
    private final NotificacionService notificacionService;
    private final UsuarioService usuarioService;

    public TicketServiceImp(TicketRepository ticketRepository, NotificacionService notificacionService, UsuarioService usuarioService) {
        this.ticketRepository = ticketRepository;
        this.notificacionService = notificacionService;
        this.usuarioService = usuarioService;
    }

    @Override
    public Ticket crearTicket(Ticket ticket, MultipartFile file) {
        // Fetch the full Usuario object from the database
        Usuario creador = usuarioService.obtenerUsuarioPorId(ticket.getUsuarioCreador().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));

        ticket.setUsuarioCreador(creador);
        ticket.setFechaCreacion(LocalDate.now());
        ticket.setEstado(EstadoTicket.CREADO);
        ticket.setPrioridad(PrioridadTicket.BAJA); // Set default priority

        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads"; // Directory to save files
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFileName = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                }
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath);
                ticket.setRutaArchivo(uniqueFileName); // Assuming Ticket entity has setRutaArchivo method
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }

        Ticket nuevoTicket = ticketRepository.save(ticket);
        notificacionService.enviarNotificacion(nuevoTicket.getUsuarioCreador().getCorreo(), "Se ha creado un nuevo ticket con ID: " + nuevoTicket.getIdTicket());
        return nuevoTicket;
    }

    @Override
    public List<Ticket> obtenerPorCreador(Usuario usuario) {
        return ticketRepository.findByUsuarioCreador(usuario);
    }

    @Override
    public List<Ticket> obtenerPorAnalista(Usuario usuario) {
        return ticketRepository.findByUsuarioAnalista(usuario);
    }

    @Override
    public List<Ticket> obtenerPorEstado(EstadoTicket estado) {
        return ticketRepository.findByEstado(estado);
    }

    @Override
    public Ticket asignarAnalista(Long idTicket, Usuario analista) {
        Ticket ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        ticket.setUsuarioAnalista(analista);
        ticket.setFechaActualizacion(LocalDate.now());
        Ticket ticketActualizado = ticketRepository.save(ticket);
        notificacionService.enviarNotificacion(analista.getCorreo(), "Se te ha asignado el ticket con ID: " + idTicket);
        return ticketActualizado;
    }

    @Override
    public Ticket actualizarEstado(Long idTicket, EstadoTicket estado) {
        Ticket ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        ticket.setEstado(estado);
        ticket.setFechaActualizacion(LocalDate.now());
        Ticket ticketActualizado = ticketRepository.save(ticket);
        notificacionService.enviarNotificacion(ticket.getUsuarioCreador().getCorreo(), "El estado de tu ticket con ID: " + idTicket + " ha sido actualizado a: " + estado);
        return ticketActualizado;
    }

    @Override
    public Ticket obtenerTicketPorId(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
    }

    @Override
    public Ticket actualizarPrioridad(Long idTicket, PrioridadTicket prioridad) {
        Ticket ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        ticket.setPrioridad(prioridad);
        ticket.setFechaActualizacion(LocalDate.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket agregarRespuesta(Long idTicket, RespuestaRequest respuesta, MultipartFile file) { // Added MultipartFile
        Ticket ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        // Append new response to historial
        String currentHistorial = ticket.getHistorial() != null ? ticket.getHistorial() : "";
        String newEntry = "\n--- Respuesta (" + LocalDate.now() + ") ---\n" + respuesta.getRespuesta();

        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads"; // Directory to save files
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFileName = file.getOriginalFilename();
                String fileExtension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                }
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath);
                newEntry += "\nArchivo adjunto: " + uniqueFileName; // Add file path to history
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file for response", e);
            }
        }

        ticket.setHistorial(currentHistorial + newEntry);
        ticket.setRespuesta(respuesta.getRespuesta()); // Update last response
        ticket.setFechaActualizacion(LocalDate.now());
        // Do not automatically set status to RESUELTO here, analyst can change it
        // ticket.setEstado(EstadoTicket.RESUELTO);
        Ticket ticketActualizado = ticketRepository.save(ticket);
        notificacionService.enviarNotificacion(ticket.getUsuarioCreador().getCorreo(), "Tu ticket con ID: " + idTicket + " ha recibido una nueva respuesta.");
        return ticketActualizado;
    }

    @Override
    public List<Ticket> listarTodosLosTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket apelarTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        // Get the authenticated user's ID
        Long authenticatedUserId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getIdUsuario();

        // Check if the authenticated user is the creator of the ticket
        if (!ticket.getUsuarioCreador().getIdUsuario().equals(authenticatedUserId)) {
            throw new RuntimeException("Solo el creador del ticket puede apelar.");
        }

        if (ticket.isApelacion()) {
            throw new RuntimeException("Este ticket ya ha sido apelado anteriormente.");
        }

        if (ticket.getEstado() != EstadoTicket.CERRADO) {
            throw new RuntimeException("Solo se pueden apelar tickets CERRADOS.");
        }

        ticket.setEstado(EstadoTicket.REABIERTO);
        ticket.setApelacion(true);
        String currentHistorial = ticket.getHistorial() != null ? ticket.getHistorial() : "";
        String newEntry = "\n--- Apelación (" + LocalDate.now() + ") ---\nEl cliente ha apelado el ticket.";
        ticket.setHistorial(currentHistorial + newEntry);
        ticket.setFechaActualizacion(LocalDate.now());

        Ticket ticketActualizado = ticketRepository.save(ticket);
        notificacionService.enviarNotificacion(ticket.getUsuarioAnalista().getCorreo(), "El ticket con ID: " + id + " ha sido reabierto por apelación.");
        return ticketActualizado;
    }

    @Override
    public Map<EstadoTicket, Long> getTicketCountsByStatusForAnalyst(Long analistaId) {
        Usuario analista = usuarioService.obtenerUsuarioPorId(analistaId)
                .orElseThrow(() -> new RuntimeException("Analista no encontrado con ID: " + analistaId));

        List<Ticket> tickets = ticketRepository.findByUsuarioAnalista(analista);

        return tickets.stream()
                .collect(Collectors.groupingBy(Ticket::getEstado, Collectors.counting()));
    }

    @Override
    public List<Ticket> obtenerTicketsPorAnalistaYEstado(Long analistaId, EstadoTicket estado) {
        Usuario analista = usuarioService.obtenerUsuarioPorId(analistaId)
                .orElseThrow(() -> new RuntimeException("Analista no encontrado con ID: " + analistaId));
        return ticketRepository.findByUsuarioAnalistaAndEstado(analista, estado);
    }
}
