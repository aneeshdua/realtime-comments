import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
import { WebsocketHandler } from './helper/api';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    WebsocketHandler()
  });
  
  return (
    <ChakraProvider>

        <CommentForm/>
        <CommentViewer/>
      
    </ChakraProvider>
  );
}

export default App;
