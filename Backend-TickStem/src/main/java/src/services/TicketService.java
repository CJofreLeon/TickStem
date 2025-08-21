package src.services;

import org.springframework.web.multipart.MultipartFile;
import src.dto.RespuestaRequest;
import src.entities.Ticket;
import src.entities.Usuario;
import src.enums.EstadoTicket;
import src.enums.PrioridadTicket;

import java.util.List;
import java.util.Map;

public interface TicketService {
    Ticket crearTicket(Ticket ticket, MultipartFile file);
    List<Ticket> obtenerPorCreador(Usuario usuario);
    List<Ticket> obtenerPorAnalista(Usuario usuario);
    List<Ticket> obtenerPorEstado(EstadoTicket estado);
    Ticket asignarAnalista(Long idTicket, Usuario analista);
    Ticket actualizarEstado(Long idTicket, EstadoTicket estado);
    Ticket obtenerTicketPorId(Long id);
    Ticket actualizarPrioridad(Long idTicket, PrioridadTicket prioridad);
        Ticket agregarRespuesta(Long id, RespuestaRequest respuesta, MultipartFile file);
    List<Ticket> listarTodosLosTickets();
    Ticket apelarTicket(Long id);
    Map<EstadoTicket, Long> getTicketCountsByStatusForAnalyst(Long analistaId);
    List<Ticket> obtenerTicketsPorAnalistaYEstado(Long analistaId, EstadoTicket estado);
}
