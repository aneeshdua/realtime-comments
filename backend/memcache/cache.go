package memcache

import (
	"sync"
)

// Cache is a basic in-memory key-value store.
type Cache struct {
	Data map[string]string
	mu   sync.RWMutex
}

func NewCache() *Cache {
	return &Cache{
		Data: make(map[string]string),
	}
}

func (c *Cache) Set(key, value string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.Data[key] = value
}

func (c *Cache) Get(key string) (string, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	value, ok := c.Data[key]
	return value, ok
}
