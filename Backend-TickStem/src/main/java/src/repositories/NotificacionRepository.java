package src.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import src.entities.Notificacion;
import src.entities.Usuario;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioDestino(Usuario usuario);
}