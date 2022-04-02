FROM node:10

COPY package.json .

RUN npm install

COPY . .

CMD ["node", "app.js"]

EXPOSE 8000
