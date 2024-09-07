FROM node:22-alpine3.19
RUN corepack enable
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json pnpm-lock.yaml /opt/app/
RUN pnpm install
COPY . .
CMD [ "pnpm", "start"]
