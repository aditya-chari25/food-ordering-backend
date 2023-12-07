FROM node:18.8.0-alpine
WORKDIR /app
COPY package.json index.js /app/
RUN npm install
RUN npm i -g nodemon
CMD ["nodemon", "index.js"]