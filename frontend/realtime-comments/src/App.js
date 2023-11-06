import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import React, { createContext, useContext, useEffect, useRef, useState,useCallback } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket"

// export const WebSocketContext = createContext(null);

function App() {
  const [commentData,setCommentData] = useState([])
  
  const WS_URL = "ws://127.0.0.1:8080/ws"
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed")
    if (readyState === ReadyState.OPEN) {
      // sendJsonMessage({
      //   name: "lib",
      //   comment: "lib"
      // })
    }
  }, [readyState])

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    // console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`)
    if(lastJsonMessage != null){
        if(commentData.length != 0){
          console.log("appending")
          setCommentData(commentData=>[...commentData,lastJsonMessage])
        } else {
          setCommentData(lastJsonMessage)
        }
    }  
  }, [lastJsonMessage])

  const handleClickSendMessage = useCallback((name,comment) => sendJsonMessage({"name":name,"comment":comment}), []);

  // Non library implementation -buggy
  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   const newSocket = new WebSocket("ws://127.0.0.1:8080/ws")
  
  //   newSocket.onopen = () => {
  //     console.log("WebSocket connection opened");
  //   };

  //   newSocket.onmessage = (event) => {
  //     console.log("Received message: ", event.data);
  //     try {
  //       const data = JSON.parse(event.data)
  //       console.log("commentData",commentData)
  //       if(commentData.length != 0){
  //         console.log("appending")
  //         setCommentData(commentData=>[...commentData,data])
  //       } else {
  //         setCommentData(data)
  //       } 
  //     } catch (e) { 
  //       console.log("Invalid data recieved from server",e);
  //     }
  //   };

  //   // newSocket.onclose = (event) => {
  //   //   if (event.wasClean) {
  //   //     console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
  //   //   } else {
  //   //     console.error("Connection died");
  //   //   }
  //   // };

  //   // newSocket.onerror = (error) => {
  //   //   console.error("WebSocket error: " + error.message);
  //   // };
  //   setSocket(newSocket);
  //   return () => {
  //     // Clean up the WebSocket connection when the component unmounts
  //     newSocket.close();
  //   };
  // }, []);

  

  return (
    <ChakraProvider>
         
          <CommentForm socketHandler={handleClickSendMessage}/>
          <CommentViewer commentData={commentData}/>
    </ChakraProvider>
  );
}

export default App;
