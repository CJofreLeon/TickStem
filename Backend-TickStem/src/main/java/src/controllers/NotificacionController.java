package src.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import src.entities.Notificacion;
import src.entities.Usuario;
import src.services.NotificacionService;
import src.services.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final UsuarioService usuarioService;

    public NotificacionController(NotificacionService notificacionService, UsuarioService usuarioService) {
        this.notificacionService = notificacionService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioService.listarTodos().stream().filter(u -> u.getIdUsuario().equals(id)).findFirst().orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(notificacionService.findByUsuarioDestino(usuario));
    }

    @PutMapping("/{id}/leido")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long id) {
        return ResponseEntity.ok(notificacionService.marcarComoLeida(id));
    }
}
