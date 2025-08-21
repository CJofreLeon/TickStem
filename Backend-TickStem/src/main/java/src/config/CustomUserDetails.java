package src.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class CustomUserDetails extends User {

    private final Long idUsuario;

    public CustomUserDetails(Long idUsuario, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.idUsuario = idUsuario;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }
}
