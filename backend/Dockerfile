FROM node:14 AS builder
WORKDIR /app
COPY . .
RUN yarn
COPY . .
RUN yarn build

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["yarn","start:prod"]