FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /nginx
# USUŃ domyślną konfigurację
RUN rm /etc/nginx/conf.d/default.conf

# Skopiuj SWÓJ config nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Skopiuj build Vite (dist)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]