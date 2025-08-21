package src.services;

import org.springframework.stereotype.Service;
import src.entities.Notificacion;
import src.entities.Usuario;
import src.repositories.NotificacionRepository;
import src.repositories.UsuarioRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificacionServiceImp implements NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    public NotificacionServiceImp(NotificacionRepository notificacionRepository, UsuarioRepository usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void enviarNotificacion(String destinatario, String mensaje) {
        Usuario usuario = usuarioRepository.findByCorreo(destinatario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + destinatario));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuarioDestino(usuario);
        notificacion.setMensaje(mensaje);
        notificacion.setFechaEnvio(LocalDate.now());
        notificacion.setLeido(false);

        notificacionRepository.save(notificacion);
    }

    @Override
    public List<Notificacion> findByUsuarioDestino(Usuario usuario) {
        return notificacionRepository.findByUsuarioDestino(usuario);
    }

    @Override
    public Notificacion marcarComoLeida(Long idNotificacion) {
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new RuntimeException("Notificacion no encontrada con ID: " + idNotificacion));
        notificacion.setLeido(true);
        return notificacionRepository.save(notificacion);
    }
}
