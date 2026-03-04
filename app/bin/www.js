"use strict";

const app = require("../app");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;

const TalksGateway = require("../src/talks/talks.gateway");
const TalksService = require("../src/talks/talks.service");
const TalksRepository = require("../src/talks/talks.repository");
const ProductRepository = require("../src/products/product.repository");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // 모든 origin 허용 (배포 시 특정 도메인으로 제한 권장)
    methods: ["GET", "POST"],
  },
});

const talksRepository = new TalksRepository();
const productRepository = new ProductRepository();
const talksService = new TalksService(talksRepository, productRepository);
const talksGateway = new TalksGateway(io, talksService);

talksGateway.initialize();

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
  console.log(`Socket.io initialized`);
});
