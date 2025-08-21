package src.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import src.enums.EstadoTicket;
import src.enums.PrioridadTicket;

import java.time.LocalDate;


@Entity
@Table(name = "ticket")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idTicket;
    @ManyToOne @JoinColumn(name = "usuario_creador_id", nullable = false)
    private Usuario usuarioCreador;
    @ManyToOne @JoinColumn(name = "usuario_analista_id")
    private Usuario usuarioAnalista;
    private String titulo;
    private LocalDate fechaCreacion;
    private LocalDate fechaActualizacion;
    private String descripcion;
    private String rutaArchivo;
    @Enumerated(EnumType.STRING)
    private EstadoTicket estado;
    @Enumerated(EnumType.STRING)
    private PrioridadTicket prioridad;
    private String respuesta;
    private boolean apelacion;
    private String historial;
}
