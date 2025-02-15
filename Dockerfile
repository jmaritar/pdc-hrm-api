# Etapa 1: Construcción de la imagen
FROM node:20 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de producción y desarrollo
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Generar el cliente Prisma (asegurándonos de que el archivo prisma/schema.prisma esté disponible)
RUN npx prisma generate

# Ejecutar las migraciones de Prisma (si es necesario)
RUN npx prisma migrate deploy

# Compilar la aplicación en el directorio dist
RUN npm run build

# Etapa 2: Imagen de producción
FROM node:20 AS production

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios para la producción
COPY package*.json ./

# Instalar las dependencias de producción
RUN npm install --only=production

# Copiar los archivos compilados desde la etapa de build
COPY --from=build /app/dist ./dist

# Copiar los archivos Prisma desde la etapa de build
COPY --from=build /app/prisma ./prisma

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
