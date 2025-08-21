package src.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import src.entities.Usuario;
import src.enums.RolUsuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    List<Usuario> findByRol(RolUsuario rol);
}