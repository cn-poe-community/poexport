package main

import (
	"dbutils/pkg/config"
	"dbutils/pkg/gem"
	"dbutils/pkg/item"
	"dbutils/pkg/utils/errorutil"
	"dbutils/pkg/utils/stringutil"
	"encoding/json"
	"os"
	"path/filepath"
)

var baseItemTypesFile string
var txBaseItemTypesFile string
var gemEffectsFile string
var txGemEffectsFile string

var gemsFile string

func init() {
	c := config.LoadConfig("../config.json")
	baseItemTypesFile = filepath.Join(c.ProjectRoot, "docs/ggpk", "data/baseitemtypes.dat64.json")
	txBaseItemTypesFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", "data/simplified chinese/baseitemtypes.dat64.json")
	gemEffectsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", "data/gemeffects.dat64.json")
	txGemEffectsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", "data/simplified chinese/gemeffects.dat64.json")

	gemsFile = filepath.Join(c.ProjectRoot, "assets/gems/gems.json")
}

func initGems(baseTypes []*item.BaseItemType, gemEffects []*gem.GemEffect) {
	gems := []*gem.Gem{}
	for _, baseType := range baseTypes {
		if !stringutil.IsASCII(baseType.Zh) &&
			(baseType.GgpkType.ItemClassesKey == 18 ||
				baseType.GgpkType.ItemClassesKey == 19) {
			gems = append(gems, &gem.Gem{
				En: baseType.En,
				Zh: baseType.Zh,
			})
		}
	}

	gemMap := map[string]*gem.Gem{}
	for _, gem := range gems {
		gemMap[gem.Zh] = gem
	}

	transfiguredGems := []*gem.Gem{}
	transfiguredGemMap := map[string]*gem.Gem{}
	for _, effect := range gemEffects {
		names := possibleGemNames(effect.Zh)
		if len(names) > 0 {
			for _, name := range names {
				if _, ok := gemMap[name]; ok { // 如果子名称是合法的宝石名称
					if _, ok := transfiguredGemMap[effect.Zh]; !ok { //避免重复添加
						g := &gem.Gem{
							En: effect.En,
							Zh: effect.Zh,
						}
						transfiguredGems = append(transfiguredGems, g)
						transfiguredGemMap[g.Zh] = g
					}
					break
				}
			}
		}
	}

	gems = append(gems, transfiguredGems...)

	data, err := json.MarshalIndent(gems, "", "  ")
	errorutil.QuitIfError(err)

	os.WriteFile(gemsFile, data, 0o666)
}

func possibleGemNames(zh string) []string {
	if stringutil.IsASCII(zh) {
		return nil
	}

	var result []string
	for i, r := range zh {
		if r == '之' && len(zh) > i+3 {
			result = append(result, zh[i+3:])
		}
	}
	return result
}

func main() {
	baseItemTypes := item.LoadBaseItemTypesFromGggpk(baseItemTypesFile, txBaseItemTypesFile)
	gemEffects := gem.LoadGemEffectsFromGgpk(gemEffectsFile, txGemEffectsFile)
	initGems(baseItemTypes, gemEffects)
}
