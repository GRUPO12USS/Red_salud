FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm install @angular/material @angular/cdk @angular/animations

COPY . .

EXPOSE 4200

CMD ["npm", "start"]