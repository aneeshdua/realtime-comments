import {
    Input, Text
  } from '@chakra-ui/react'
  import styles from "./CommentViewer.module.scss"
import Comment from '../Comment/Comment';
  
  export default function CommentViewer(commentData) {
      // console.log(commentData)
      return (
        <>
            <div className={styles.ViewerCtn}>
                <Text fontSize='4xl'>Comments</Text>
                {/* {commentData.map((value,index) => (
                  <Comment name="value"/>
                ))} */}
                {/* <Comment name="Santa"/>
                <Comment name="Banta"/> */}
            </div>
        </>
      );
    }
  