package main

import "github.com/patrickmn/go-cache"

type commentsCache struct {
	commentList *cache.Cache
}

type commentRequestBody struct {
	Name    string `json:"name"`
	Comment string `json:"comment"`
}
