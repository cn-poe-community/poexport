package item

import (
	"dbutils/pkg/utils/errorutil"
	"encoding/json"
	"log"
	"os"
)

func LoadBaseItemTypesFromGggpk(ggpkBaseItemTypesFile, txGgpkBaseItemTypesFile string) []*BaseItemType {
	enEntries := loadGgpkBaseItemTypes(ggpkBaseItemTypesFile)
	zhEntries := loadGgpkBaseItemTypes(txGgpkBaseItemTypesFile)

	baseItemTypes, err := mergeGgpkBaseItemTypes(enEntries, zhEntries)
	if err != nil {
		log.Fatal(err)
	}
	return baseItemTypes
}

func loadGgpkBaseItemTypes(filename string) []*GgpkBaseItemType {
	data, err := os.ReadFile(filename)
	errorutil.QuitIfError(err)

	var entries []*GgpkBaseItemType

	json.Unmarshal(data, &entries)

	return entries
}

func mergeGgpkBaseItemTypes(enEntries, zhEntries []*GgpkBaseItemType) ([]*BaseItemType, error) {
	enEntriesIndexedByHash := map[int]*GgpkBaseItemType{}
	for _, entry := range enEntries {
		enEntriesIndexedByHash[entry.HASH32] = entry
	}

	result := []*BaseItemType{}

	for _, zhEntry := range zhEntries {
		baseItemType := &BaseItemType{
			Zh:         zhEntry.Name,
			ZhGgpkType: zhEntry,
		}
		if enEntry, ok := enEntriesIndexedByHash[zhEntry.HASH32]; ok {
			baseItemType.En = enEntry.Name
			baseItemType.GgpkType = enEntry
			result = append(result, baseItemType)
		}
	}

	return result, nil
}
