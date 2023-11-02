export async function sendComment(name,comment){
  const resp = await fetch("http://localhost:8080/addComment",{
    method: 'POST',
    body: JSON.stringify({
      "name": name,
      "comment": comment
    })
  })
  const data = await resp.text()
  console.log(data)
}

