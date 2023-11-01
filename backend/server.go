package main

import (
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"

	"websocket-server/memcache"

	"github.com/gorilla/websocket"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	var (
		/**
		websocketUpgrader is used to upgrade incomming HTTP requests into a persitent websocket connection
		*/
		websocketUpgrader = websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}
	)

	cache := memcache.NewCache()

	readAllComments(cache)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		websocketUpgrader.CheckOrigin = func(r *http.Request) bool { return true }
		websocket, err := websocketUpgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Websocket Connected!")
		listen(websocket, cache)
	})

	http.HandleFunc("/addComment", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		body, err := io.ReadAll(r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("error in processing request"))
			slog.Error("Error reading request")
		}
		var commentBody commentRequestBody
		err = json.Unmarshal(body, &commentBody)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("error in processing request body"))
			slog.Error("Error unmarshaling request body")
		}
		if commentBody.Name != "" && commentBody.Comment != "" {
			err := storeComment(commentBody, cache)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("error in processing request"))
				slog.Error("Error writing comment to datastore")
			} else {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("comment added successfully"))
			}
		} else {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("atleast one of the fields is empty"))
		}
	})

	// Serve on port :8080
	slog.Info("Running at 8080")
	log.Fatal(http.ListenAndServe("localhost:8080", nil))

}

func listen(conn *websocket.Conn, cache *memcache.Cache) {
	for {
		// read a message
		// _, messageContent, err := conn.ReadMessage()
		// if err != nil {
		// 	log.Println(err)
		// 	return
		// }
		var commentList []commentRequestBody
		commentList = processCacheObjects(cache)
		if err := conn.WriteJSON(commentList); err != nil {
			log.Println(err)
			return
		}
		// if string(messageContent) == "fetchComments" {
		// 	var commentList []commentRequestBody
		// 	commentList = processCacheObjects(cache)
		// 	if err := conn.WriteJSON(commentList); err != nil {
		// 		log.Println(err)
		// 		return
		// 	}
		// }

	}
}
