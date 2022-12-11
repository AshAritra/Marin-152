FROM node:bullseye-slim
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*
COPY package.json .
RUN npm install npm@latest
RUN yarn install --network-concurrency 1
COPY . .
EXPOSE 8000
CMD ["npm", "npm start"]
