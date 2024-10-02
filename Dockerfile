FROM node:18-alpine AS builder
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN rm node_modules/@pinata/sdk/types/index.d.ts
COPY . .
RUN mv lib-fix/pinata.d.ts node_modules/@pinata/sdk/types/index.d.ts
RUN pnpm run build

FROM node:18-alpine

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install -P --frozen-lockfile

RUN rm node_modules/@pinata/sdk/types/index.d.ts
COPY --from=builder ./home/node/app/node_modules/@pinata/sdk/types/index.d.ts ./node_modules/@pinata/sdk/types/index.d.ts
COPY --from=builder ./home/node/app/dist ./dist


CMD [ "node", "dist/main" ]