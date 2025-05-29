FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]

# No es necesario exponer el puerto aquí, lo hacemos en docker-compose.yml