# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación React
RUN npm run build

# Instala 'serve' para servir la aplicación estática
RUN npm install -g serve

# Expone el puerto en el que se ejecutará la aplicación React
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
