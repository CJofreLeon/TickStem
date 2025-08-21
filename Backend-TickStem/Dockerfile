# Usa una imagen base de Java 24
FROM openjdk:24-jdk-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo pom.xml y el directorio src
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn ./.mvn

# Construye la aplicación Spring Boot
# Se usa -Dmaven.test.skip=true para saltar los tests durante la construcción del Docker
RUN ./mvnw clean package -Dmaven.test.skip=true -X

# Expone el puerto en el que se ejecuta la aplicación Spring Boot
EXPOSE 8080

# Define el comando para ejecutar la aplicación
# El nombre del JAR se obtiene del pom.xml (artifactId-version.jar)
ENTRYPOINT ["java", "-jar", "target/src-0.0.1-SNAPSHOT.jar"]
