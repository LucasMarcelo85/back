# Backend: Node.js + Express + Prisma
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json* ./

# Instala dependências de produção
RUN npm ci --only=production

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta (use a mesma do seu app, ou PORT do ambiente)
EXPOSE 3000

# Inicia a aplicação diretamente com node (mais seguro em Docker)
CMD ["node", "dist/index.js"]
