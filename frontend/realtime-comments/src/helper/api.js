export function WebsocketHandler() {
    let socket = new WebSocket("ws://127.0.0.1:8080");

    socket.onopen = function(e) {
      console.log("[open] Connection established");
      // alert("Sending to server");
      socket.send("fetchComments");
    };
    
    // socket.onmessage = function(event) {
    //   console.log(`[message] Data received from server: ${event.data}`);
    //   CommentContext = event.data
    // };
    
    // socket.onclose = function(event) {
    //   if (event.wasClean) {
    //     alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    //   } else {
    //     // e.g. server process killed or network down
    //     // event.code is usually 1006 in this case
    //     alert('[close] Connection died');
    //   }
    // };
    
    socket.onerror = function(error) {
      alert(`[error]`);
    };

    return socket
}

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

