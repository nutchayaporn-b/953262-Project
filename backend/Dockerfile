FROM node:16 as build
WORKDIR /app/backend
COPY package.json /app/backend/
RUN npm install
COPY . /app/backend/
ENV DATABASE_URL="mysql://root@host.docker.internal:3306/restaurant"
RUN npm run deploy
CMD ["npm", "start"]

