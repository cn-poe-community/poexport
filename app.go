package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"poexport/pkg/config"
	"poexport/pkg/logger"
	"poexport/pkg/poe"
	"poexport/pkg/update"
	"strings"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	poeClientLock sync.RWMutex
	poeClient     *poe.PoeClient
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	defer func() {
		if r := recover(); r != nil {
			message := fmt.Sprint(r)
			message = strings.TrimSpace(message)
			if len(message) == 0 {
				message = "未知错误"
			}

			a.showStartupError(message)
			os.Exit(1)
		}
	}()

	runtime.WindowSetMinSize(ctx, 500, 500)
	runtime.WindowSetMaxSize(ctx, 500, 500)
	runtime.WindowSetTitle(ctx, fmt.Sprintf("poexport %v", VersionNumber))

	err := a.doStartup()
	if err != nil {
		a.showStartupError(err.Error())
		os.Exit(1)
	}
}

func (a *App) showStartupError(message string) {
	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.ErrorDialog,
		Title:   "启动错误",
		Message: message,
	})
}

func (a *App) doStartup() error {
	_, err := logger.Init()
	if err != nil {
		return err
	}
	err = config.Init()
	if err != nil {
		return err
	}
	a.poeClient, err = poe.NewPoeClient(config.Conf().PoeSessId)
	if err != nil {
		return err
	}

	go func() {
		if ok := update.CheckForUpdate(); ok {
			latest := update.Latest()
			needUpdate, err := update.Less(VersionNumber, latest.Latest)
			if err != nil {
				log.Printf("compare version failed: %v", err)
				return
			}
			if needUpdate {
				runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
					Type:    runtime.InfoDialog,
					Title:   "更新提示",
					Message: fmt.Sprintf("当前版本%v，最新版本%v", VersionNumber, latest.Latest),
				})
			}
		}
	}()

	return nil
}

type StringResult struct {
	Data string `json:"data"`
	Err  string `json:"err"`
}

type BoolResult struct {
	Data bool   `json:"data"`
	Err  string `json:"err"`
}

func (a *App) GetCharacters(accountName, realm string) StringResult {
	a.poeClientLock.RLock()
	defer a.poeClientLock.RUnlock()

	data, err := a.poeClient.GetCharacters(accountName, realm)
	if err != nil {
		return StringResult{
			"",
			err.Error(),
		}
	}
	return StringResult{
		data,
		"",
	}
}

func (a *App) GetItems(accountName, character, realm string) StringResult {
	a.poeClientLock.RLock()
	defer a.poeClientLock.RUnlock()

	data, err := a.poeClient.GetItems(accountName, character, realm)
	if err != nil {
		return StringResult{
			"",
			err.Error(),
		}
	}
	return StringResult{
		data,
		"",
	}
}

func (a *App) GetPassiveSkills(accountName, character, realm string) StringResult {
	a.poeClientLock.RLock()
	defer a.poeClientLock.RUnlock()

	data, err := a.poeClient.GetPassiveSkills(accountName, character, realm)
	if err != nil {
		return StringResult{
			"",
			err.Error(),
		}
	}
	return StringResult{
		data,
		"",
	}
}

func (a *App) GetConfig() config.Config {
	return config.Conf()
}

func (a *App) SetPoeSessId(poeSessId string) BoolResult {
	c := config.Conf()
	if c.PoeSessId == poeSessId {
		return BoolResult{
			true,
			"",
		}
	}
	c.PoeSessId = poeSessId
	err := config.Save(c)
	if err != nil {
		return BoolResult{
			false,
			err.Error(),
		}
	}

	a.poeClientLock.Lock()
	defer a.poeClientLock.Unlock()
	newClient, err := poe.NewPoeClient(poeSessId)
	if err != nil {
		return BoolResult{
			false,
			err.Error(),
		}
	}
	a.poeClient = newClient
	return BoolResult{
		true,
		"",
	}
}

type UpdateInfo struct {
	NeedUpdate bool   `json:"needUpdate"`
	Current    string `json:"current"`
	Latest     string `json:"latest"`
	Changelog  string `json:"changelog"`
	Ok         bool   `json:"ok"`
}

func (a *App) CheckForUpdate() UpdateInfo {
	latest := update.Latest()
	if latest == nil {
		return UpdateInfo{
			Current: VersionNumber,
			Ok:      false,
		}
	}

	needUpdate, err := update.Less(latest.Latest, VersionNumber)
	if err != nil {
		log.Printf("check for update failed: %v", err)
		return UpdateInfo{
			Current: VersionNumber,
			Ok:      false,
		}
	}

	return UpdateInfo{
		Latest:     latest.Latest,
		Current:    VersionNumber,
		Changelog:  latest.Changelog,
		NeedUpdate: needUpdate,
		Ok:         true,
	}
}
