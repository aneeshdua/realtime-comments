export async function sendComment(name,comment,setName,setComment){
  const resp = await fetch("http://localhost:8080/addComment",{
    method: 'POST',
    body: JSON.stringify({
      "name": name,
      "comment": comment
    })
  })
  const status = await resp.status
  if(status === 200){
    setName('')
    setComment('')
    alert("Comment added succesfully")
  } else {
    alert("Error while uploading comment. Please try again!",status)
  }
}

