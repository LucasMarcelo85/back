# Imagem base Node.js
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json* ./
COPY . .

# Instala dependências
RUN npm install

# Expõe a porta usada pela aplicação
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "server.js"]