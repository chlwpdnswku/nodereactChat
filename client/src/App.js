import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';
// 백엔드 와 연결  실제로잘되느지 테스트
const socket = io.connect('http://localhost:3001');

function App() {
  // 이름과 변경함수

  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  // 처음엔 비공개방
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    // 사용자와 방이름이 빈칸이아니면
    if (username !== '' && room !== '') {
      // 이벤트 내보내기 백엔드와 이름을 같이 저장해서
      socket.emit('join_room', room);
      // 방에들어가면 채팅을 참으로 변경을해야 됨
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join A chat </h3>
          <input
            type='text'
            placeholder='ID....'
            // 단지 사용자의 이름을 이벤트 타겟과 같게 설정을하고싶다
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          ></input>
          {/* 두개의 로그인화면 */}
          <input
            type='text'
            placeholder='Room id'
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          ></input>
          <button onClick={joinRoom}>Join A room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
