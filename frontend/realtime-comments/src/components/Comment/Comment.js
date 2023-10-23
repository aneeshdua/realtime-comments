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
              <Text as='b' className={styles.UserName}>{props.name}</Text>
            </div>
          </div>
          <div class={styles.CommentText}>
          <Text>Actually, now that I try out the links on my message, above, none of them take me to the secure site. Only my shortcut on my desktop, which I created years ago.</Text>
          </div>
        </div>
      </>
    );
  }
