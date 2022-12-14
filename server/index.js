const express = require("express");

const app = express();

const http = require("http");
// 이게 왜쓰이는지 공부하지
const cors = require("cors");
// 소켓 라이브러리 내부에서 가져오기
const { Server } = require("socket.io");

app.use(cors());
// http 와 서버 만들기
const server = http.createServer(app);

// 서버생성해서 인스턴스를 하기 서버 통과하기 코스설정
const io = new Server(server, {
  // 원본설정 소켓과 통신 일부 코스문제 해결
  cors: {
    origin: "http://localhost:3000",
    // 요청과 게시 나중에 삭제나 이런것까지구현?
    methods: ["GET", "POST"],
  },
});
// 미들웨어

// 연결과 비연결 알수있는것
io.on("connection", (socket) => {
  // 연결이됬다고 뜸
  console.log(`User Connected: ${socket.id}`);
  // 누군가 방을 들어오길원함 실제로 data 보내기 가능

  socket.on("join_room", (data) => {
    socket.join(data);

    // 유저아이디와 룸아이디의 데이터들 입력받는 백엔드
    console.log(`User with ID: ${socket.id} joined room ; ${data}`);
  });

  // 소켓메세지 내보내기 누군가 메세지를 입력할때마다 메세지를 보내는 것
  socket.on("send_message", (data) => {
    // 누구나 to 프론트 엔드로 데이터를 보내고
    socket.to(data.room).emit("receive_message", data);
  });

  //
  socket.on("disconnect", () => {
    console.log("user Disconnected", socket.id);
  });
});

// 서버 포트 저장하기
server.listen(3001, () => {
  console.log("SERVER START");
});
