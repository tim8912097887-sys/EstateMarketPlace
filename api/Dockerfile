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
# Copy configuration file first to cache dependencies
COPY package.json pnpm-lock.yaml ./
# Enhance the build speed by link to the installed dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build Stage Transpile ts code to js
FROM base AS build
# Include the devDependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy from current directory
COPY . .
# Create the /app/dist folder
RUN pnpm exec tsc

# Pro
FROM base AS prod-deps
# Copy configuration file first to cache dependencies
COPY package.json pnpm-lock.yaml ./
# Use --prod flag to install only dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Final Stage(actual image)
FROM node:24-slim
ENV NODE_ENV=development
WORKDIR /app
# Copy tanspile code from build stage
COPY --from=build /app/dist ./dist
# Copy dependencies from prod-devs stage
COPY --from=prod-deps /app/node_modules ./node_modules

# Security: Don't run as root
USER node

EXPOSE 3001
# Run the compiled javascript directly
CMD [ "node", "dist/server.js" ]