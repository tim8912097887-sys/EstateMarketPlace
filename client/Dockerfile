# Base Stage
FROM node:24-slim AS base
# Setup pnpm enviroment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Set working directory
WORKDIR /app

# Dependencies Stage install all dependencies(include devDeps)
FROM base AS deps
# Copy configuration file first to cache the dependencies
COPY package.json pnpm-lock.yaml ./
# Enhance the build speed by link to the installed dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build Stage transpile ts code to js
FROM base AS build
# Include the devDependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy from current directory
COPY . .
# Create the /app/dist folder
RUN pnpm run build

# Production Stage include only dependencies
FROM base AS prod-deps
# Copy configuration file first to cache the dependencies
COPY package.json pnpm-lock.yaml ./
# Use --prod flag to install only dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Final Stage(serve with Nginx decreas the image size)
FROM nginx:alpine AS production
# Set the working directory to Nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static file from build stage to Nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html
# This config replaces the Vite Proxy for Production
RUN printf 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # PROXY CONFIG: Everything starting with /api goes to the backend container\n\
    location /api/ {\n\
        proxy_pass http://api:3001/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection "upgrade";\n\
        proxy_set_header Host $host;\n\
        proxy_cache_bypass $http_upgrade;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

