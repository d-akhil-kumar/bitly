FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build


FROM node:20-alpine AS prod

WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]