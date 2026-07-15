FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy optional nginx config if custom routing is needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
