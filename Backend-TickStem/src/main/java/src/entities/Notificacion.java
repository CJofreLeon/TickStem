package src.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Entity
@Table(name = "notificacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idNotificacion;
    private String mensaje;
    @ManyToOne
    @JoinColumn(name = "usuario_destino_id", nullable = false)
    private Usuario usuarioDestino;
    private LocalDate fechaEnvio;
    private Boolean leido;
}
