# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first (layer caching — only re-runs npm install
# if package.json changes, not every time your code changes)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your source code
COPY . .

# Build the production React app (outputs to /app/dist)
ARG VITE_GROQ_API_KEY
ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────
FROM nginx:alpine AS runner

# Copy compiled React app from Stage 1 into Nginx's serve folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]