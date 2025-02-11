# Stage 1: Build React app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Inject backend URL via build-time environment variable
ARG API_URL
ENV API_URL=$API_URL
RUN npm run build

# Stage 2: Serve React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]