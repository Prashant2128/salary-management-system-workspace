FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY tsconfig.json ./
COPY knexfile.cjs ./
COPY migrations ./migrations
COPY src ./src
COPY scripts ./scripts
COPY data ./data
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/knexfile.cjs ./knexfile.cjs
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/data ./data
EXPOSE 3001
CMD ["npm", "start"]
