FROM quay.io/sampandey001/secktor
ARG CACHEBUST=1
RUN git clone https://github.com/AshAritra/Marin-152 /root/AshAritra
WORKDIR /root/AshAritra/
RUN npm install npm@latest
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm", "start"]
