# Usamos la imagen oficial de Microsoft que ya viene con los navegadores instalados
FROM ://microsoft.com

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto asignado por Railway
EXPOSE 3000

CMD ["node", "server.js"]
