package main

import (
	"fmt"
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
	log.Fatal(http.ListenAndServe(":8080", nil))

	// Serve on port :8080
	(http.ListenAndServe(":8080", nil))
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

// // Manager is a HTTP Handler that the has the Manager that allows connections
// func Manager(w http.ResponseWriter, r *http.Request) {

// 	log.Println("New connection")
// 	// Begin by upgrading the HTTP request
// 	conn, err := websocketUpgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}
// 	// We wont do anything yet so close connection again
// 	conn.Close()
// }
