FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl python3 make g++

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar todas as dependências
RUN npm install

# Copiar código fonte
COPY src ./src/

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Remover arquivos desnecessários
RUN rm -rf src

# Reinstalar apenas as dependências de produção
RUN npm install --production

EXPOSE 3001

CMD ["npm", "start"] 