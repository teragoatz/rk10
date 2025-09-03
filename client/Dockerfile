# Build the React app
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Apache (TODO)
# FROM httpd:2.4
# COPY --from=builder /app/build /usr/local/apache2/htdocs/
# COPY apache.conf /usr/local/apache2/conf/extra/react.conf
# RUN echo "Include conf/extra/react.conf" >> /usr/local/apache2/conf/httpd.conf
# EXPOSE 80
# CMD ["httpd-foreground"]