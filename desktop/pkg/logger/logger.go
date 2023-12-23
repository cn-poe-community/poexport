package logger

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

// Init inits the default log.Default() by setting it's output to log files.
// The app's main() should call the function when init.
func Init() (logFile *os.File, err error) {
	exeName, err := os.Executable()
	if err != nil {
		return nil, err
	}

	exPath := filepath.Dir(exeName)
	logsPath := filepath.Join(exPath, "logs")
	err = os.MkdirAll(logsPath, os.ModePerm)
	if err != nil {
		return nil, err
	}
	f, err := os.OpenFile(filepath.Join(logsPath, logFileName()), os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening log file: %v", err)
	}
	log.Default().SetOutput(f)
	return f, nil
}

func logFileName() string {
	now := time.Now()
	return fmt.Sprintf("%s.log", now.Format("2006-01-02"))
}
