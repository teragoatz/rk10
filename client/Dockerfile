# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage (serving with nginx)
FROM nginx:alpine
ARG API_TOKEN
ENV API_TOKEN=${API_TOKEN}
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s/REPLACE_THIS_KEY/${API_TOKEN}/g" /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]