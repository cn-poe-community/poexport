package update

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"
)

var apis = []string{
	"http://42.193.7.36:8888/api/version/export",
	"https://poe.pathof.top/api/version/export",
}

type Version struct {
	Latest    string `json:"latest"`
	Changelog string `json:"changelog"`
}

type updater struct {
	latest *Version
	lock   sync.RWMutex
}

func (u *updater) CheckForUpdate() (ok bool) {
	for _, api := range apis {
		log.Printf("try checking for update from: %s", api)
		resp, err := http.Get(api)
		if err != nil {
			log.Printf("failed to check for update: %v", err)
			continue
		}
		data, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Printf("failed to check for update: %v", err)
			continue
		}

		var latest Version
		err = json.Unmarshal(data, &latest)
		if err != nil {
			log.Printf("failed to check for update: %v", err)
			continue
		}

		log.Printf("check for update success: %v", latest)
		u.lock.Lock()
		defer u.lock.Unlock()
		u.latest = &latest
		return true
	}
	log.Print("check for update failed: all apis does not work")
	return false
}

func (u *updater) Latest() *Version {
	u.lock.RLock()
	defer u.lock.RUnlock()
	return u.latest
}

var defaultUpdater updater

func CheckForUpdate() (ok bool) {
	return defaultUpdater.CheckForUpdate()
}

func Latest() *Version {
	return defaultUpdater.Latest()
}
