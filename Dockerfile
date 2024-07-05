FROM node:22.2-alpine as production

WORKDIR /user/src/app

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "dist/app.js"]