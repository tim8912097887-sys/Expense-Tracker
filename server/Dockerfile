ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base
# Setting Pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Pnpm automatically uses the mounted path
ENV PNPM_CONFIG_STORE_DIR="/pnpm/store"
RUN corepack enable

FROM base AS dev_dep
WORKDIR /app
# Enhance build speed by cache
COPY package.json pnpm-lock.yaml ./
# Use cache mount enhance install speed
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS pro_dep
WORKDIR /app
# Enhance build speed by cache
COPY package.json pnpm-lock.yaml ./
# Install production dependencies only
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM dev_dep AS build
WORKDIR /app
COPY . .
RUN pnpm build

# Final stage
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
# Copy production only packages
COPY --from=pro_dep /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node","dist/server.js"]