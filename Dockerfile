# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm install --omit=dev
RUN npm install -g @nestjs/cli

COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa final (imagen liviana)
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
