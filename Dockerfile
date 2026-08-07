# Usamos una imagen oficial limpia de Node.js basada en Debian (Bookworm)
FROM node:20-bookworm

# Instalar dependencias del sistema y los navegadores de Playwright con un solo comando
RUN npx -y playwright@1.50.0 install --with-deps chromium

WORKDIR /app

# Copiar archivos de configuración para instalar tus paquetes de Node
COPY package*.json ./
RUN npm install

# Copiar el código del servidor
COPY . .

# Exponer el puerto de Railway
EXPOSE 3000

CMD ["node", "server.js"]
