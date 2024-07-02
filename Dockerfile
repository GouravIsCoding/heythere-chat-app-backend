# build stage

FROM node:18-alpine as build

WORKDIR /app

COPY package-lock.json package.json prisma ./

RUN npm ci

RUN npx prisma generate

COPY . .


RUN npm install -g typescript

RUN npm run build

# start stage

FROM node:18-alpine

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm ci -omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .

USER node

EXPOSE 8080

CMD [ "pm2-runtime","start","ecosystem.config.js" ]

