package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
	"time"
	"websocket-server/memcache"
)

func readJSONFile(filename string) ([]byte, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func processCacheObjects(commentMap *memcache.Cache) []commentRequestBody {
	commentList := make([]commentRequestBody, 0)
	for _, value := range commentMap.Data {
		var comment commentRequestBody
		err := json.Unmarshal([]byte(value), &comment)
		if err != nil {
			fmt.Println("error in processing cache data")
		} else {
			commentList = append(commentList, comment)
		}

	}
	return commentList
}

func readAllComments(commentsData *memcache.Cache) {
	files, err := filepath.Glob("datastore/*.json")
	if err != nil {
		fmt.Println("Error: Unable to find JSON files in the current directory.")
		return
	}
	// Use a WaitGroup to wait for all goroutines to finish
	var wg sync.WaitGroup

	for _, file := range files {
		wg.Add(1)
		go func(filename string) {
			defer wg.Done()
			data, err := readJSONFile(filename)
			if err != nil {
				fmt.Printf("Error reading file %s: %v\n", filename, err)
				return
			}
			var comment commentRequestBody
			err = json.Unmarshal(data, &comment)
			if err != nil {
				fmt.Println(err)
			}
			commentsData.Set(filename, string(data))
			// memcache.AddtoCache(commentsData, filename, string(data))
			// commentsData.commentList.Set(filename, comment, cache.DefaultExpiration)
			slog.Info("Cached %s\n", filename)
		}(file)
	}

	// Wait for all goroutines to finish
	wg.Wait()
}

func storeComment(commentBody commentRequestBody, commentsData *memcache.Cache) error {
	now := time.Now().UnixMilli()
	file, _ := json.MarshalIndent(commentBody, "", " ")
	err := os.WriteFile(fmt.Sprintf("datastore/%+v.json", now), file, 0644)
	commentsData.Set(fmt.Sprintf("%+v", now), string(file))
	// memcache.AddtoCache(commentsData, fmt.Sprintf("%+v", now), string(file))
	// commentsData.commentList.Set(fmt.Sprintf("datastore/%+v.json", now), commentBody, cache.DefaultExpiration)
	// fmt.Println(commentsData.commentList.Items())
	return err
}
