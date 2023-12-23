package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	ProjectRoot string `json:"projectRoot"`
	Ggpk        string `json:"ggpk"`
	TxGgpk      string `json:"txGgpk"`
	TxPoesessid string `json:"txPoesessid"`
}

func LoadConfig(path string) *Config {
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	var config Config

	err = json.Unmarshal(data, &config)
	if err != nil {
		log.Fatal(err)
	}

	return &config
}
