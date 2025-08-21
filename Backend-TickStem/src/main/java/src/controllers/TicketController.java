package src.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;
import src.dto.RespuestaRequest;
import src.entities.Ticket;
import src.entities.Usuario;
import src.enums.EstadoTicket;
import src.enums.PrioridadTicket;
import src.services.TicketService;
import src.services.UsuarioService;
import src.repositories.UsuarioRepository; // Import UsuarioRepository

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository; // Inject repository directly for debugging

    public TicketController(TicketService ticketService, UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.ticketService = ticketService;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository; // Inject
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> obtenerTodosLosTickets() {
        return ResponseEntity.ok(ticketService.listarTodosLosTickets());
    }

    @GetMapping("/analista/{analistaId}/counts")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA', 'ANALISTA') and authentication.principal.idUsuario == #analistaId")
    public ResponseEntity<Map<EstadoTicket, Long>> getTicketCountsByStatusForAnalyst(@PathVariable Long analistaId) {
        Map<EstadoTicket, Long> counts = ticketService.getTicketCountsByStatusForAnalyst(analistaId);
        return ResponseEntity.ok(counts);
    }

    @GetMapping("/analista/{analistaId}/estado/{estado}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA', 'ANALISTA') and authentication.principal.idUsuario == #analistaId")
    public ResponseEntity<List<Ticket>> obtenerTicketsPorAnalistaYEstado(@PathVariable Long analistaId, @PathVariable EstadoTicket estado) {
        List<Ticket> tickets = ticketService.obtenerTicketsPorAnalistaYEstado(analistaId, estado);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> obtenerMisTickets(Authentication authentication) {
        String userEmail = authentication.getName();
        System.out.println("Authenticated user email: " + userEmail);

        // TEMPORARY DEBUGGING: Directly use repository
        Usuario usuario = usuarioRepository.findByCorreo(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado (direct repo call)"));
        System.out.println("Direct repo call found user: " + usuario.getCorreo()); // New log

        return ResponseEntity.ok(ticketService.obtenerPorCreador(usuario));
    }

    @PostMapping
    public ResponseEntity<Ticket> crearTicket(@RequestPart("ticket") String ticketJson,
                                              @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        // Convert ticketJson string to Ticket object
        ObjectMapper objectMapper = new ObjectMapper();
        Ticket ticket = objectMapper.readValue(ticketJson, Ticket.class);

        return ResponseEntity.ok(ticketService.crearTicket(ticket, file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> obtenerTicketPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.obtenerTicketPorId(id));
    }

    @GetMapping("/creador/{id}")
    public ResponseEntity<List<Ticket>> obtenerPorCreador(@PathVariable Long id) {
        Usuario usuario = usuarioService.listarTodos().stream().filter(u -> u.getIdUsuario().equals(id)).findFirst().orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(ticketService.obtenerPorCreador(usuario));
    }

    @GetMapping("/analista/{id}")
    public ResponseEntity<List<Ticket>> obtenerPorAnalista(@PathVariable Long id) {
        Usuario usuario = usuarioService.listarTodos().stream().filter(u -> u.getIdUsuario().equals(id)).findFirst().orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(ticketService.obtenerPorAnalista(usuario));
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA', 'ANALISTA', 'CLIENTE')") // Explicitly allow roles
    public ResponseEntity<List<Ticket>> obtenerPorEstado(@PathVariable EstadoTicket estado) {
        return ResponseEntity.ok(ticketService.obtenerPorEstado(estado));
    }

    @PutMapping("/{id}/asignar/{analistaId}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA')")
    public ResponseEntity<Ticket> asignarAnalista(@PathVariable Long id, @PathVariable Long analistaId) {
        Usuario analista = usuarioService.listarTodos().stream().filter(u -> u.getIdUsuario().equals(analistaId)).findFirst().orElseThrow(() -> new RuntimeException("Analista no encontrado"));
        return ResponseEntity.ok(ticketService.asignarAnalista(id, analista));
    }

    @PutMapping("/{id}/estado/{estado}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA', 'ANALISTA')")
    public ResponseEntity<Ticket> actualizarEstado(@PathVariable Long id, @PathVariable EstadoTicket estado) {
        return ResponseEntity.ok(ticketService.actualizarEstado(id, estado));
    }

    @PutMapping("/{id}/prioridad/{prioridad}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA')")
    public ResponseEntity<Ticket> actualizarPrioridad(@PathVariable Long id, @PathVariable PrioridadTicket prioridad) {
        return ResponseEntity.ok(ticketService.actualizarPrioridad(id, prioridad));
    }

    @PutMapping("/{id}/responder")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN', 'JEFATURA', 'ANALISTA')") // Added ANALISTA
    public ResponseEntity<Ticket> agregarRespuesta(@PathVariable Long id,
                                                  @RequestPart("respuesta") String respuestaJson, // Changed to RequestPart String
                                                  @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException { // Added MultipartFile
        ObjectMapper objectMapper = new ObjectMapper();
        RespuestaRequest respuesta = objectMapper.readValue(respuestaJson, RespuestaRequest.class); // Convert JSON string to object
        return ResponseEntity.ok(ticketService.agregarRespuesta(id, respuesta, file)); // Pass file to service
    }

    @PutMapping("/{id}/apelar")
    @PreAuthorize("hasAnyAuthority('CLIENTE')") // Only CLIENTE can appeal
    public ResponseEntity<Ticket> apelarTicket(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.apelarTicket(id));
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        } catch (IOException ex) {
            throw new RuntimeException("Error reading file " + fileName, ex);
        }
        throw new RuntimeException("File not found " + fileName);
    }
}
