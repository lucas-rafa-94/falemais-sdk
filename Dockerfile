FROM node
RUN mkdir -p /app/
COPY . /app/
WORKDIR /app
RUN npm install
WORKDIR /app/demo
RUN npm install

EXPOSE 9025

RUN cd /app/demo

CMD ["npm", "start"]
