package errorutil

import "log"

func QuitIfError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}
