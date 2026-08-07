# Usamos la imagen oficial desde Docker Hub para evitar el error de sintaxis en Railway
FROM playwright/chromium:v1.49.0

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

CMD ["node", "server.js"]
