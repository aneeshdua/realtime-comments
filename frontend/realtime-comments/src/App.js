import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import { WebsocketHandler } from './helper/api';
import React, { useEffect, useRef, useState } from 'react';

function fetchComments(socket,setCommentData) {
  // socket.send("fetchComments");
  socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    setCommentData(JSON.parse(event.data))
    console.log("random",JSON.parse(event.data))
  };
}

function App() {
  const [commentData,setCommentData] = useState([])
  // const socket = WebsocketHandler(setCommentData)
  // useEffect(() => {
    
  //   // const socket = WebsocketHandler(setCommentData)
  //   // fetchComments(socket,setCommentData)
  // });



  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8080/ws")

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      console.log("Received message: ", event.data);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error("Connection died");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: " + error.message);
    };

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  

  return (
    <ChakraProvider>

        <CommentForm/>
        <CommentViewer commentData={commentData}/>
      
    </ChakraProvider>
  );
}

export default App;
