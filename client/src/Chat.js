import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

// 메세지를 보내고 받을 위치 라는것 그래서 socket이 필요
function Chat({ socket, username, room }) {
  // 메세지의 입력값 추척
  const [currentMessage, setCurrentMessage] = useState("");
  //   실제로 메세지를 표시하는 방법
  const [messageList, setMessageList] = useState([]);

  // 버튼 클릭이벤트 구현 비동기가 개꿀임 ㄹㅇ
  const sendMessage = async () => {
    // 방을 추척하는데room 이 빈방이아니면
    if (currentMessage !== "") {
      const messageData = {
        // 어떤방인지알고싶음
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      //   소켓메세지내보내기 비동기를해서 바로 보내줄 수 가있다.
      await socket.emit("send_message", messageData);
      //   나한테도 내가 보낸 메세지가보이는것
      setMessageList((list) => [...list, messageData]);
      // 메세지를 보내면  빈칸이 되게하는 것
      setCurrentMessage("");
    }
  };
  // 변경사항이있을때마다 수신 백엔드 이벤트-> 프론트엔드로 보낼 데이터 가져오기 data
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // 현재 상태를 파악 해서 하고 이전과 같은목록 -> 이이벤트가 수신될때마다 방금 받은 새메세지를 추가
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              //다른사람일경우에는 반대편에 채팅로그가 뜨게하기
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                {/* 메세지를 두개로 나눌건데 실제로 내가 작성한 메세지와  하나는 메세지의 메타 */}
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>

                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          //
          type="text"
          // 메세지에 빈칸을 만듬
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
