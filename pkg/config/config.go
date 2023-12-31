package config

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/adrg/xdg"
)

type Config struct {
	PoeSessId string `json:"poeSessId"`
}

func defaultConfig() Config {
	return Config{
		PoeSessId: "",
	}
}

// configStore manages configuration file.
//
// Public method of configStore is sync safe，including Load(),Config(),Save()。
type configStore struct {
	configPath string
	rwLock     sync.RWMutex
	config     Config
}

func newConfigStore() (*configStore, error) {
	configFilePath, err := xdg.ConfigFile("poexport/config.json")
	if err != nil {
		return nil, fmt.Errorf("could not resolve path for config file: %w", err)
	}

	return &configStore{
		configPath: configFilePath,
	}, nil
}

// Load loads configuration file.
func (s *configStore) Load() error {
	s.rwLock.Lock()
	defer s.rwLock.Unlock()

	cfg, err := s.loadOrDefault()
	s.config = cfg
	return err
}

// loadOrDefault does loading work. The default value is returned if an error occurs.
func (s *configStore) loadOrDefault() (Config, error) {
	_, err := os.Stat(s.configPath)
	if os.IsNotExist(err) {
		log.Printf("config file path is not exist, use default config: %v", s.configPath)
		return defaultConfig(), nil
	}

	dir, fileName := filepath.Split(s.configPath)
	if len(dir) == 0 {
		dir = "."
	}

	buf, err := fs.ReadFile(os.DirFS(dir), fileName)
	if err != nil {
		rtnErr := fmt.Errorf("could not read the configuration file: %v", err)
		log.Print(rtnErr.Error())
		return Config{}, rtnErr
	}

	log.Printf("loaded config from %v", s.configPath)

	if len(buf) == 0 {
		log.Print("empty config file, use default config")
		return defaultConfig(), nil
	}

	cfg := defaultConfig()
	if err := json.Unmarshal(buf, &cfg); err != nil {
		rtnErr := fmt.Errorf("configuration file does not have a valid format: %v", err)
		log.Print(rtnErr)
		return Config{}, rtnErr
	}

	return cfg, nil
}

// Config returns a copy of config.
func (s *configStore) Config() Config {
	s.rwLock.RLock()
	defer s.rwLock.RUnlock()
	return s.config
}

// Save updates config, and save config to file.
func (s *configStore) Save(config Config) error {
	s.rwLock.Lock()
	defer s.rwLock.Unlock()

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return fmt.Errorf("could not marshal the configuration data: %w", err)
	}

	s.config = config

	os.WriteFile(s.configPath, data, 0o644)
	if err != nil {
		return fmt.Errorf("could not write the configuration file: %w", err)
	}

	return nil
}

var defaultConfigStore *configStore

// Init inits the default ConfigStore.
// The app's main() should call the function when init.
func Init() error {
	store, err := newConfigStore()
	if err != nil {
		return err
	}
	defaultConfigStore = store

	defaultConfigStore.Load()
	return nil
}

// Conf return config copy.
func Conf() Config {
	return defaultConfigStore.Config()
}

// Save saves config to memory store and disk file.
func Save(c Config) error {
	return defaultConfigStore.Save(c)
}
