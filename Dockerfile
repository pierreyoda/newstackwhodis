# Dependencies installer
FROM node:15-alpine AS dependencies

WORKDIR /src/app/praca/website/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Builder
FROM node:15-alpine AS builder

ENV NODE_ENV=production
WORKDIR /src/app/praca/website/

COPY . .
COPY --from=dependencies /src/app/praca/website/node_modules ./node_modules
RUN yarn build

# Runner (production image)
FROM node:15-alpine AS runner

ARG X_TAG
WORKDIR /src/app/praca/website/
ENV NODE_ENV=production
COPY --from=builder /src/app/praca/website/next.config.js ./
COPY --from=builder /src/app/praca/website/public ./public
COPY --from=builder /src/app/praca/website/.next ./.next
COPY --from=builder /src/app/praca/website/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]
