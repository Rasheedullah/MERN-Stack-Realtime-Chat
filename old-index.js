import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";


const app = express();
const PORT = 4000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  //   res.json({ data: "Hello world from socekt" });
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {

  socket.on("send-message", (data)=>{
    socket.broadcast.emit("message-fromm-server", data);
  console.log("Message recieved", data);
})
 
socket.on("typing", ()=> {
 console.log('someone typing')
});
socket.on("disconnect", (socket) => {
  console.log("Youser Left");
})
});

httpServer.listen(PORT, () => {
  console.log("Server is running at http://localhost:4000");
});
