CREATE TABLE usuario (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    fechaCreacion DATE NOT NULL DEFAULT (CURRENT_DATE)
);

INSERT INTO usuario (nombre, correo, contrasena, rol, fechaCreacion)
VALUES ('Superadmin', 'superadmin@email.com', '$2b$12$OlhxFQ/4sKSMsx0AQ6qTTO8Ys/AZXFOI/ePgm8Od3TWxRcS0nXjhW', 'SUPERADMIN', CURDATE());
