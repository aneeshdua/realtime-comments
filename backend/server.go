package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"github.com/patrickmn/go-cache"
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
	commentsData := newCache()
	readAllComments(commentsData)

	commentMap := commentsData.commentList.Items()
	var commentList []commentRequestBody

	// Iterate over the map and append the values to the slice
	for _, value := range commentMap {
		comment, ok := value.Object.(commentRequestBody)
		if ok {
			commentList = append(commentList, comment)
		} else {
			slog.Error("Cache corrupted")
		}
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		websocketUpgrader.CheckOrigin = func(r *http.Request) bool { return true }
		websocket, err := websocketUpgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Websocket Connected!")
		listen(websocket, commentList)
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
			err := storeComment(commentBody, commentsData)
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

func listen(conn *websocket.Conn, commentList []commentRequestBody) {
	for {
		// read a message
		_, messageContent, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		if string(messageContent) == "fetchComments" {
			if err := conn.WriteJSON(commentList); err != nil {
				log.Println(err)
				return
			}
		}

	}
}

func storeComment(commentBody commentRequestBody, commentsData *commentsCache) error {
	now := time.Now().UnixMilli()
	file, _ := json.MarshalIndent(commentBody, "", " ")
	err := os.WriteFile(fmt.Sprintf("datastore/%+v.json", now), file, 0644)
	commentsData.commentList.Set(fmt.Sprintf("datastore/%+v.json", now), commentBody, cache.DefaultExpiration)
	return err
}
