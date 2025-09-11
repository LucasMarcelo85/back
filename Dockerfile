# Dockerfile para o backend (Node.js + Express + Prisma)
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta padrão (ajuste se necessário)
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
