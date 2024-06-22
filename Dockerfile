FROM node:22.2-alpine as development

WORKDIR /user/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22.2-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /user/src/app

COPY package*.json .

RUN npm ci --only=production 

COPY --from=development /user/src/app/dist ./dist

CMD ["node", "dist/app.js"]


