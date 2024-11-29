FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["nodemon", "--legacy-watch", "index.js"] 