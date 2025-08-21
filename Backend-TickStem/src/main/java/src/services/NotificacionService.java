package src.services;

import src.entities.Notificacion;
import src.entities.Usuario;

import java.util.List;

public interface NotificacionService {
    void enviarNotificacion(String destinatario, String mensaje);
    List<Notificacion> findByUsuarioDestino(Usuario usuario);
    Notificacion marcarComoLeida(Long idNotificacion);
}
