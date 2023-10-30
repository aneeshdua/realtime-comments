package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/patrickmn/go-cache"
)

const (
	defaultExpiration = 5 * time.Minute
	purgeTime         = 10 * time.Minute
)

func newCache() *commentsCache {
	Cache := cache.New(defaultExpiration, purgeTime)
	return &commentsCache{
		commentList: Cache,
	}
}

func readJSONFile(filename string) ([]byte, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func readAllComments(commentsData *commentsCache) {
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
			commentsData.commentList.Set(filename, comment, cache.DefaultExpiration)
			slog.Info("Cached %s\n", filename)
		}(file)
	}

	// Wait for all goroutines to finish
	wg.Wait()
}
