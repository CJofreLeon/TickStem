package src.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import src.enums.RolUsuario;

import java.time.LocalDate;


@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idUsuario;
    private String nombre;
    @Column(unique = true, nullable = false)
    private String correo;
    private String contrasena;
    @Enumerated(EnumType.STRING)
    private RolUsuario rol;
    private LocalDate fechaCreacion;
}
