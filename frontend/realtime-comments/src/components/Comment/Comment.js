import {
  Text
} from '@chakra-ui/react'
import styles from "./Comment.module.scss"
import logo from "../../assets/logo.svg"
export default function Comment(props) {
  return (
      <>
        <div className={styles.CommentCtn}>
          <div className={styles.UserBanner}>
            <div className={styles.UserBanner}>
              <img src={logo} height={48} width={48}/>
              <Text as='b' className={styles.UserName}>{props.props.name}</Text>
            </div>
          </div>
          <div class={styles.CommentText}>
          <Text>{props.props.comment}</Text>
          </div>
        </div>
      </>
    );
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          