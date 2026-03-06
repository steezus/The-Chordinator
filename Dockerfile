# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Run stage: serve static files with nginx
FROM nginx:alpine

# SPA: serve index.html for all routes; correct MIME for JS/CSS
RUN rm -rf /usr/share/nginx/html/* && \
    echo 'server { \
      listen 80; \
      root /usr/share/nginx/html; \
      index index.html; \
      location / { try_files $uri $uri/ /index.html; } \
      location ~* \.(js|css|svg|ico|woff2?)$ { add_header Cache-Control "public, max-age=31536000"; } \
    }' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
