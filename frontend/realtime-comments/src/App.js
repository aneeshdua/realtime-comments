import './App.css';
import CommentForm from './components/CommentForm/CommentForm'
import { ChakraProvider } from '@chakra-ui/react'
import CommentViewer from './components/CommentViewer/CommentViewer';
function App() {
  return (
    <ChakraProvider>
     
        <CommentForm/>
        <CommentViewer/>
      
    </ChakraProvider>
  );
}

export default App;
