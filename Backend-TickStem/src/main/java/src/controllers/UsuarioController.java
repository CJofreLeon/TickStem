package src.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import src.dto.AuthResponse;
import src.dto.LoginRequest;
import src.entities.Usuario;
import src.enums.RolUsuario;
import src.services.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;

    public UsuarioController(UsuarioService usuarioService, AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.registrarUsuario(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getCorreo(), loginRequest.getContrasena()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(usuarioService.login(userDetails));
    }

    @PostMapping("/superadmin")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<Usuario> crearSuperUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.crearSuperUsuario(usuario));
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> obtenerPorCorreo(@PathVariable String correo) {
        return usuarioService.obtenerPorCorreo(correo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<Usuario>> listarPorRol(@PathVariable RolUsuario rol) {
        return ResponseEntity.ok(usuarioService.listarPorRol(rol));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/test-email/{email}")
    public ResponseEntity<Usuario> testObtenerPorCorreo(@PathVariable String email) {
        return usuarioService.obtenerPorCorreo(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SUPERADMIN') or authentication.name == #usuario.correo")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        // In a real application, you'd typically use a DTO for updates
        // and ensure only allowed fields are updated.
        // For now, we'll pass the whole Usuario object to the service.
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuario));
    }
}
