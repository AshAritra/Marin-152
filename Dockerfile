FROM node:lts-buster
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
COPY package.json .
RUN npm install npm
RUN yarn install --network-concurrency 1
COPY . .
EXPOSE 10000
CMD ["npm", "start"]
