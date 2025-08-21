package src.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import src.entities.Ticket;
import src.entities.Usuario;
import src.enums.EstadoTicket;
import src.enums.PrioridadTicket;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUsuarioCreador(Usuario usuario);
    List<Ticket> findByUsuarioAnalista(Usuario usuario);
    List<Ticket> findByEstado(EstadoTicket estado);
    List<Ticket> findByPrioridad(PrioridadTicket prioridad);
    List<Ticket> findByUsuarioAnalistaAndEstado(Usuario analista, EstadoTicket estado);
}