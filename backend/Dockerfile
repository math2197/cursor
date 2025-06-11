FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./

# Instalar todas as dependências
RUN npm install

COPY . .

# Limpar build anterior e gerar cliente Prisma
RUN rm -rf dist && npx prisma generate

# Compilar TypeScript
RUN npm run build

# Remover node_modules e reinstalar apenas as dependências de produção
RUN rm -rf node_modules && npm install --production

EXPOSE 3001

CMD ["npm", "start"] 