import {
    Text
  } from '@chakra-ui/react'
  import styles from "./CommentViewer.module.scss"
import Comment from '../Comment/Comment';
  
export default function CommentViewer(commentData) {
    return (
      <>
          <div className={styles.ViewerCtn}>
              <Text fontSize='4xl'>Comments</Text>
              {commentData.commentData.map((value,index) => (
                <Comment key={value.name} props={value}/>
              ))}
          </div>
      </>
    );
  }
  