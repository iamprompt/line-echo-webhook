FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm package manager
RUN yarn global add pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

ENV LINE_CHANNEL_ACCESS_TOKEN $LINE_CHANNEL_ACCESS_TOKEN

# Expose port 3000
EXPOSE 3000

# Run the app
CMD node dist/index.js