FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Remover node_modules e reinstalar apenas as dependências de produção
RUN rm -rf node_modules && npm install --production

EXPOSE 3001

CMD ["npm", "start"] 