
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    ARG NEXT_PUBLIC_SUPABASE_URL
    ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
    ARG CLERK_PUBLISHABLE_KEY
    
    ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
    ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
    ENV CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY
    
    COPY package.json pnpm-lock.yaml ./
    RUN npm i -g pnpm && pnpm install
    
    COPY . .

    RUN ls -alh /app
    
    RUN pnpm run build
    
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=3000

    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/next.config.ts ./next.config.ts
    
    EXPOSE 3000
    
    RUN npm install -g pnpm
    
    CMD ["pnpm", "start"]
    
