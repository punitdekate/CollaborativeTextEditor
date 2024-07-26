import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectToMongoose from "./src/config/configDB.js";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const configPath = path.resolve("src", "config", ".env");
dotenv.config({ path: configPath });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
// app.use("/api", documentRoutes);
app.use(express.static("public"));

// let documentData = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (documentId) => {
    socket.join(documentId);
    if (documentData[documentId]) {
      socket.emit("document", documentData[documentId]);
    }
  });

  socket.on("edit", (data) => {
    const { documentId, content } = data;
    documentData[documentId] = content;
    socket.to(documentId).emit("document", content);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  connectToMongoose();
});
