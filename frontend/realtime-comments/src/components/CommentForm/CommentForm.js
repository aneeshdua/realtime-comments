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

export default function CommentForm(props) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  // const socket = useContext(WebSocketContext)

 

  async function commentSubmitHandler(){
    // if(socket!=null){
    //   const obj = [{
    //     "name":name,
    //     "comment":comment
    //   }]
    //   socket.send(JSON.stringify(obj))
    // }
    await sendComment(name,comment,setName,setComment)
    props.socketHandler(name,comment)
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
