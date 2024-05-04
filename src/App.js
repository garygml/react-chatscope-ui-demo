import logo from './logo.svg';
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import './App.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState } from 'react';

function App() {

  const [url, setUrl] = useState("http://127.0.0.1:8000/answer")
  const [header, setHeader] = useState("")


  const [messages, setMessages] = useState([]);

  const messageItems = messages.map((m) =>
    <Message model = {m}/>
  );

  const onMessageSend = (text) => {
    console.log(text)
    let oldMessages = messages
    callApiForBotResponse(text, oldMessages)
  }

  const callApiForBotResponse = async (input, oldChatHistory) => {

    await setMessages(
      [
        ...messages,
        {
          message: input,
          sentTime: "just now",
          sender: "human",
          position: 'single'
        }
      ]
    )

    let oldChatHistoryAsTextList = oldChatHistory.map((m) =>
      m.message
    );
    console.log(oldChatHistoryAsTextList)


    await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
       "input": input,
       "chat_history": oldChatHistoryAsTextList,
       //userId: Math.random().toString(36).slice(2),
    }),
    headers: {
       'Content-type': 'application/json; charset=UTF-8',
    },
    })
    .then((response) => response.json())
    .then((data) => {

      setMessages(
        [
          ...oldChatHistory,
          {
            message: input,
            sentTime: "just now",
            sender: "human",
            position: 'single'
          },
          {
            message: data.output,
            sentTime: "just now",
            sender: "bot",
            position: 'single',
            direction: 'incoming',
          }
        ]
      )
    })
    .catch((err) => {
       console.log(err.message);
       setMessages(
        [
          ...oldChatHistory,
          {
            message: input,
            sentTime: "just now",
            sender: "human",
            position: 'single'
          },
          {
            message: "(Seems that some errors were happening)",
            sentTime: "just now",
            sender: "bot",
            position: 'single',
            direction: 'incoming',
          }
        ]
      )
    });
    };
  
  
  return (

    <div className="App">
      <div style={{ position: "relative", height: "100vh" }}>
        <MainContainer style={{fontSize:"1.2em"}}>
          <ChatContainer style={{  "background-color": "plum"}}>
            <MessageList>
            <input style={{width: "100vw"}} id="url" value={url} onChange={e => setUrl(e.target.value)}/>
            <input style={{width: "100vw"}} id="header" value={header} onChange={e => setHeader(e.target.value)}/>

              {messageItems}
            </MessageList>
            <MessageInput attachButton={false} placeholder="Type message here" onSend={onMessageSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App;
