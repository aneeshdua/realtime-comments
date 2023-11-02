import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);
// export const WebSocketProvider = ({ socket, children }) => (
//   <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
// );

// export const useWebSocket = () => {
//   const socket = useContext(WebSocketContext);
//   if (!socket) {
//     throw new Error("useWebSocket must be used within a WebSocketProvider");
//   }
//   return socket;
// };


function App() {
  const [commentData,setCommentData] = useState([])
  
  // var socket
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket("ws://127.0.0.1:8080/ws")

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      console.log("Received message: ", event.data);
      try {
        const data = JSON.parse(event.data)
        setCommentData(data)
      } catch (e) {
         console.log("Invalid data recieved from server");
      }
    };

    // newSocket.onclose = (event) => {
    //   if (event.wasClean) {
    //     console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
    //   } else {
    //     console.error("Connection died");
    //   }
    // };

    // newSocket.onerror = (error) => {
    //   console.error("WebSocket error: " + error.message);
    // };
    setSocket(newSocket);
    return () => {
      // Clean up the WebSocket connection when the component unmounts
      newSocket.close();
    };
  }, []);

  

  return (
    <ChakraProvider>
         <WebSocketContext.Provider value={socket}>
          <CommentForm/>
          <CommentViewer commentData={commentData}/>
        </WebSocketContext.Provider>
    </ChakraProvider>
  );
}

export default App;
