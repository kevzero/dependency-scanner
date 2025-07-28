FROM node:18-alpine

WORKDIR /app

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./

# Installa le dipendenze nel container Linux
RUN npm install

# Copia il resto del progetto (escluso node_modules grazie a .dockerignore)
COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
