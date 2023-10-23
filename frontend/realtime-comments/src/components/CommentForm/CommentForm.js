import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button
} from '@chakra-ui/react'
import styles from "./CommentForm.module.scss"

export default function CommentForm() {
    return (
      <>
        <div className={styles.FormCtn}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input/>
            <FormHelperText>Enter your name</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Comment</FormLabel>
            <Input/>
            <FormHelperText>Enter your Comment</FormHelperText>
          </FormControl>
          <Button
              mt={4}
              colorScheme='teal'
              type='submit'
            >
              Submit
            </Button>
          </div>
      </>
    );
  }
