package src.services;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import src.dto.AuthResponse;
import src.entities.Usuario;
import src.enums.RolUsuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService extends UserDetailsService {
    Usuario registrarUsuario(Usuario usuario);
    AuthResponse login(UserDetails userDetails);
    Optional<Usuario> obtenerPorCorreo(String correo);
    Optional<Usuario> obtenerUsuarioPorId(Long id);
    Optional<Usuario> obtenerUsuarioPorCorreo(String correo);
    List<Usuario> listarPorRol(RolUsuario rol);
    List<Usuario> listarTodos();
    Usuario crearSuperUsuario(Usuario usuario);
    Usuario actualizarUsuario(Long id, Usuario usuario);
}
