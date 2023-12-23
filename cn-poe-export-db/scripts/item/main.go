package main

import (
	"dbutils/pkg/config"
	"dbutils/pkg/item"
	"dbutils/pkg/utils/errorutil"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
)

var c *config.Config
var baseItemTypesFile string
var txBaseItemTypesFile string

func init() {
	c = config.LoadConfig("../config.json")
	baseItemTypesFile = filepath.Join(c.ProjectRoot, "docs/ggpk", "data/baseitemtypes.dat64.json")
	txBaseItemTypesFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", "data/simplified chinese/baseitemtypes.dat64.json")
}

type Tattoo struct {
	En string `json:"en"`
	Zh string `json:"zh"`
}

var enTattooKeyword = "Tattoo"
var zhTattooKeyword = "文身"

func initTattoos(itemTypes []*item.BaseItemType) {
	tattoosFile := filepath.Join(c.ProjectRoot, "assets/tattoos.json")

	tattoos := []*Tattoo{}
	for _, itemType := range itemTypes {
		if strings.Contains(itemType.En, enTattooKeyword) && strings.Contains(itemType.Zh, zhTattooKeyword) {
			tattoos = append(tattoos, &Tattoo{
				En: itemType.En,
				Zh: itemType.Zh,
			})
		}
	}

	data, err := json.MarshalIndent(tattoos, "", "  ")
	errorutil.QuitIfError(err)

	os.WriteFile(tattoosFile, data, 0o666)
}

var enFlaskSuffix = "Flask"
var zhFlaskSuffix = "药剂"
var enTinctureSuffix = "Tincture"
var zhTinctureSuffix = "酊剂"
var flaskClassesKeys = map[int]bool{0: true, 1: true, 2: true, 33: true}
var tinctureClassesKey = 89

func updateFlasks(itemTypes []*item.BaseItemType) {
	flasksFile := filepath.Join(c.ProjectRoot, "assets/flasks.json")
	//tincturesFile := filepath.Join(c.ProjectRoot, "assets/flasks/tinctures.json")

	new_flasks := []*item.BaseItemType{}
	for _, itemType := range itemTypes {
		if strings.HasSuffix(itemType.En, enFlaskSuffix) &&
			strings.HasSuffix(itemType.Zh, zhFlaskSuffix) &&
			flaskClassesKeys[itemType.GgpkType.ItemClassesKey] {
			new_flasks = append(new_flasks, &item.BaseItemType{
				En: itemType.En,
				Zh: itemType.Zh,
			})
		}
	}

	for _, itemType := range itemTypes {
		if strings.HasSuffix(itemType.En, enTinctureSuffix) &&
			strings.HasSuffix(itemType.Zh, zhTinctureSuffix) &&
			itemType.GgpkType.ItemClassesKey == tinctureClassesKey {
			new_flasks = append(new_flasks, &item.BaseItemType{
				En: itemType.En,
				Zh: itemType.Zh,
			})
		}
	}

	data, err := os.ReadFile(flasksFile)
	errorutil.QuitIfError(err)

	flasks := []*item.DbBaseItemType{}

	err = json.Unmarshal(data, &flasks)
	errorutil.QuitIfError(err)

	flaskMap := map[string]*item.DbBaseItemType{}
	for _, f := range flasks {
		flaskMap[f.Zh] = f
	}

	for _, f := range new_flasks {
		if _, ok := flaskMap[f.Zh]; !ok {
			flasks = append(flasks, item.NewDbBaseItemType(f))
		}
	}

	data, err = json.MarshalIndent(flasks, "", "    ")
	errorutil.QuitIfError(err)

	os.WriteFile(flasksFile, data, 0o666)
}

var zhCharmSuffix = "咒符"
var charmClassesKey = 91

func updateJewels(itemTypes []*item.BaseItemType) {
	jewelsFile := filepath.Join(c.ProjectRoot, "assets/jewels.json")
	//tincturesFile := filepath.Join(c.ProjectRoot, "assets/flasks/tinctures.json")

	newJewels := []*item.BaseItemType{}
	for _, itemType := range itemTypes {
		if strings.HasSuffix(itemType.Zh, zhCharmSuffix) && itemType.GgpkType.ItemClassesKey == charmClassesKey {
			newJewels = append(newJewels, &item.BaseItemType{
				En: itemType.En,
				Zh: itemType.Zh,
			})
		}
	}

	data, err := os.ReadFile(jewelsFile)
	errorutil.QuitIfError(err)

	jewels := []*item.DbBaseItemType{}

	err = json.Unmarshal(data, &jewels)
	errorutil.QuitIfError(err)

	jewelMap := map[string]*item.DbBaseItemType{}
	for _, f := range jewels {
		jewelMap[f.Zh] = f
	}

	for _, f := range newJewels {
		if _, ok := jewelMap[f.Zh]; !ok {
			jewels = append(jewels, item.NewDbBaseItemType(f))
		}
	}

	data, err = json.MarshalIndent(jewels, "", "    ")
	errorutil.QuitIfError(err)

	os.WriteFile(jewelsFile, data, 0o666)
}

func main() {
	baseItemTypes := item.LoadBaseItemTypesFromGggpk(baseItemTypesFile, txBaseItemTypesFile)
	initTattoos(baseItemTypes)
	updateFlasks(baseItemTypes)
	updateJewels(baseItemTypes)
}
