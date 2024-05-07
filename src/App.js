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

  // const [url, setUrl] = useState("http://127.0.0.1:8000/answer")
  // const [header, setHeader] = useState(JSON.stringify({
  //   'Content-type': 'application/json; charset=UTF-8',
  // }))
  const [chatDisabled, setChatDisabled] = useState(false)


  const [messages, setMessages] = useState([]);

  const messageItems = messages.map((m) =>
    <Message model = {m}/>
  );

  // const onHeaderChange = (e) => {
  //   let text = e.target.value
  //   setHeader(text)

  //   try {
  //     let h = JSON.parse(text)
  //     setChatDisabled(false)
  //   } catch (error) {
  //     setChatDisabled(true)
  //   }
    
  // }

  const onMessageSend = (text) => {
    console.log(text)
    let oldMessages = messages
    setMessages(
      [
        ...messages,
        {
          message: text,
          sentTime: "just now",
          sender: "human",
          position: 'single'
        }
      ]
    )
    setChatDisabled(true)
    callApiForBotResponse(text, oldMessages)
  }

  const callApiForBotResponse = async (input, oldChatHistory) => {

    let oldChatHistoryAsTextList = oldChatHistory.map((m) =>
      m.message
    );
    console.log(oldChatHistoryAsTextList)

    // let h = JSON.parse(header);

    await fetch(
    process.env.REACT_APP_ANSWER_URL, 
    // process.env.NODE_ENV !== 'production' ? 
    // {
    //   method: 'GET'
    // }:
    {
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
      setChatDisabled(false)
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
      setChatDisabled(false)
    });
    };
  
  
  return (

    <div className="App">
      <div style={{ position: "relative", height: "100vh" }}>
        <MainContainer style={{fontSize:"1.2em"}}>
          <ChatContainer style={{  "background-color": "plum"}}>
            <MessageList>
            {/* <input style={{width: "100vw"}} id="url" value={url} onChange={e => setUrl(e.target.value)}/>
            <textarea style={{width: "100vw"}} id="header" value={header} onChange={onHeaderChange}/> */}

              {messageItems}
            </MessageList>
            <MessageInput disabled={chatDisabled} attachButton={false} placeholder="Type message here" onSend={onMessageSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App;
