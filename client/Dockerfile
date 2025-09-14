# Build stage
FROM node:20-alpine AS build
ARG API_TOKEN
ENV REACT_APP_API_TOKEN=${API_TOKEN}
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage (serving with nginx)
FROM nginx:alpine
ARG API_TOKEN
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s/REPLACE_THIS_KEY/${API_TOKEN}/g" /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]