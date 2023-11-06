import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

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
  console.log("page refreshed")
  const [commentData,setCommentData] = useState([])
  console.log("commentData init",commentData)
  // var socket
  const [socket, setSocket] = useState(null);
  const ws = useRef(null);


  // useEffect(() => {
  //     ws.current = new WebSocket("ws://127.0.0.1:8080/ws");
    
  //     ws.current.onopen = () => {
  //       console.log("WebSocket connection opened");
  //     };
  
  //     ws.current.onmessage = (event) => {
  //       console.log("Received message: ", event.data);
  //       try {
  //         const data = JSON.parse(event.data)
  //         console.log("commentData",commentData)
  //         if(commentData.length != 0){
  //           console.log("appending")
  //           setCommentData(commentData=>[...commentData,data])
  //         } else {
  //           setCommentData(data)
  //         }
           
  //       } catch (e) { 
  //         console.log("Invalid data recieved from server",e);
  //       }
  //     };
  
  //     ws.current.onclose = (event) => {
  //       if (event.wasClean) {
  //         console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
  //       } else {
  //         console.error("Connection died");
  //       }
  //     };
  //     const wsCurrent = ws.current;

  //     return () => {
  //         wsCurrent.close();
  //     };
      
  //     // newSocket.onerror = (error) => {
  //     //   console.error("WebSocket error: " + error.message);
  //     // };
  //     // setSocket(newSocket);
  //     // return () => {
  //     //   // Clean up the WebSocket connection when the component unmounts
  //     //   newSocket.close();
  //     // };
  //   }, []);

  useEffect(() => {
    const newSocket = new WebSocket("ws://127.0.0.1:8080/ws")
  
    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      console.log("Received message: ", event.data);
      try {
        const data = JSON.parse(event.data)
        console.log("commentData",commentData)
        if(commentData.length != 0){
          console.log("appending")
          setCommentData(commentData=>[...commentData,data])
        } else {
          setCommentData(data)
        } 
      } catch (e) { 
        console.log("Invalid data recieved from server",e);
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
