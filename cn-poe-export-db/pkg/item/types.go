package item

type GgpkBaseItemType struct {
	HASH32         int
	Name           string
	ItemClassesKey int
}

type BaseItemType struct {
	En         string
	Zh         string
	GgpkType   *GgpkBaseItemType
	ZhGgpkType *GgpkBaseItemType
}

type DbUnique struct {
	Zh string `json:"zh"`
	En string `json:"en"`
}

type DbBaseItemType struct {
	Zh      string      `json:"zh"`
	En      string      `json:"en"`
	Uniques []*DbUnique `json:"uniques,omitempty"`
}

func NewDbBaseItemType(t *BaseItemType) *DbBaseItemType {
	return &DbBaseItemType{
		En: t.En,
		Zh: t.Zh,
	}
}
