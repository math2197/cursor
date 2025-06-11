FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl python3 make g++

# Copiar arquivos de configuração
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

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

CMD ["/wait-for-it.sh", "db:5432", "--", "sh", "-c", "npx prisma migrate deploy && npm start"] 