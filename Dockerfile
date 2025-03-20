FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci

# Copiar todo o código-fonte
COPY . .

# Expor a porta padrão do Angular
EXPOSE 4200

# Comando para rodar a aplicação com hot-reload
CMD ["ng", "serve"]
