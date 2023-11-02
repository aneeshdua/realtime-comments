import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button
} from '@chakra-ui/react'
import styles from "./CommentForm.module.scss"
import { useContext, useEffect, useState } from 'react';
import { sendComment } from '../../helper/api';
import { WebSocketContext} from '../../App';

export default function CommentForm() {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const socket = useContext(WebSocketContext)

  useEffect(() => {
    // Access the WebSocket instance in your child component
    console.log("Child component is using the WebSocket connection");
    if(socket != null){
      console.log("chala")
    }
  }, [socket]);


  async function commentSubmitHandler(){
    if(socket!=null){
      socket.send("xya")
    }
    await sendComment(name,comment,setName,setComment)
  }
  return (
      <>
        <div className={styles.FormCtn}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={event => setName(event.currentTarget.value)}/>
            <FormHelperText>Enter your name</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Input value={comment} onChange={event => setComment(event.currentTarget.value)}/>
            <FormHelperText>Enter your Comment</FormHelperText>
          </FormControl>
          <Button
              mt={4}
              colorScheme='teal'
              type='submit'
              onClick={commentSubmitHandler}
            >
              Submit
            </Button>
          </div>
      </>
    );
  }
