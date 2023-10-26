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

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		websocketUpgrader.CheckOrigin = func(r *http.Request) bool { return true }
		websocket, err := websocketUpgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Websocket Connected!")
		listen(websocket)
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
			err := storeComment(commentBody)
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
	log.Fatal(http.ListenAndServe(":8080", nil))

}

func listen(conn *websocket.Conn) {
	for {
		// read a message
		messageType, messageContent, err := conn.ReadMessage()
		timeReceive := time.Now()
		if err != nil {
			log.Println(err)
			return
		}

		// print out that message
		fmt.Println(string(messageContent))

		// reponse message
		messageResponse := fmt.Sprintf("Your message is: %s. Time received : %v", messageContent, timeReceive)

		if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
			log.Println(err)
			return
		}

	}
}

func storeComment(commentBody commentRequestBody) error {
	now := time.Now().UnixMilli()
	file, _ := json.MarshalIndent(commentBody, "", " ")
	err := os.WriteFile(fmt.Sprintf("datastore/%+v.json", now), file, 0644)
	return err
}
