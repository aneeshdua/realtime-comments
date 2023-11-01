import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import { WebsocketHandler } from './helper/api';
import React, { useEffect, useState } from 'react';

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
  useEffect(() => {
    const socket = WebsocketHandler()
    // fetchComments(socket,setCommentData)
  });
  
  return (
    <ChakraProvider>

        <CommentForm/>
        <CommentViewer commentData={commentData}/>
      
    </ChakraProvider>
  );
}

export default App;
