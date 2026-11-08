FROM node:22-alpine
# pnpm 8: the lockfile is v6, which newer pnpm ignores (it would re-resolve every dependency)
RUN corepack enable && corepack prepare pnpm@8.15.9 --activate
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json pnpm-lock.yaml /opt/app/
RUN pnpm install --frozen-lockfile
COPY . .
CMD [ "pnpm", "start"]
