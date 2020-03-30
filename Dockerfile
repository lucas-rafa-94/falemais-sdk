FROM node
RUN mkdir -p /app/
COPY . /app/
WORKDIR /app
RUN npm install
WORKDIR /app/demo
RUN npm install

EXPOSE 8080

RUN cd /app/demo

CMD ["npm", "start"]
