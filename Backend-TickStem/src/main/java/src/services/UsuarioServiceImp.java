package src.services;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import src.config.CustomUserDetails; // Added
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import src.dto.AuthResponse;
import src.dto.LoginRequest;
import src.entities.Usuario;
import src.enums.RolUsuario;
import src.repositories.UsuarioRepository;
import src.config.JwtUtil;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImp implements UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UsuarioServiceImp(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setFechaCreacion(LocalDate.now());
        // Set a default role if it's not already set (e.g., from a superadmin creation)
        if (usuario.getRol() == null) {
            usuario.setRol(RolUsuario.CLIENTE); // Set default role to CLIENTE
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public AuthResponse login(UserDetails userDetails) {
        String token = jwtUtil.generateToken(userDetails);
        Usuario usuario = usuarioRepository.findByCorreo(userDetails.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new AuthResponse(token, usuario);
    }

    @Override
    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return Optional.empty();
    }

    @Override
    public Optional<Usuario> obtenerUsuarioPorCorreo(String correo) {
        Optional<Usuario> foundUser = usuarioRepository.findByCorreo(correo);
        System.out.println("UsuarioServiceImp: findByCorreo for " + correo + " returned: " + foundUser.isPresent());
        return foundUser;
    }

    @Override
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }



    @Override
    public List<Usuario> listarPorRol(RolUsuario rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + username));

        return new CustomUserDetails(usuario.getIdUsuario(), usuario.getCorreo(), usuario.getContrasena(),
                Collections.singletonList(new SimpleGrantedAuthority(usuario.getRol().name())));
    }

    @Override
    public Usuario crearSuperUsuario(Usuario usuario) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (userDetails.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("SUPERADMIN"))) {
            throw new RuntimeException("Solo un SUPERADMIN puede crear otro SUPERADMIN");
        }
        usuario.setRol(RolUsuario.SUPERADMIN);
        return registrarUsuario(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        // Update only allowed fields
        usuarioExistente.setNombre(usuarioActualizado.getNombre());
        usuarioExistente.setRol(usuarioActualizado.getRol());

        return usuarioRepository.save(usuarioExistente);
    }
}
