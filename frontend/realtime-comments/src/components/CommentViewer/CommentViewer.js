import {
    Input, Text
  } from '@chakra-ui/react'
  import styles from "./CommentViewer.module.scss"
import Comment from '../Comment/Comment';
  
  export default function CommentViewer() {
      return (
        <>
            <div className={styles.ViewerCtn}>
                <Text fontSize='4xl'>Comments</Text>
                <Comment name="Santa"/>
                <Comment name="Banta"/>
            </div>
        </>
      );
    }
  