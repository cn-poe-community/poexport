package gem

type GgpkIndexableSupportGem struct {
	Index int
	Name  string
}

type IndexableSupportGem struct {
	Index int
	Zh    string
	En    string
}

type GgpkIndexableSkillGem struct {
	Index int
	Name1 string
}

type IndexableSkillGem struct {
	Index int
	Zh    string
	En    string
}

type Gem struct {
	En string `json:"en"`
	Zh string `json:"zh"`
}

type GgpkGemEffect struct {
	Id   string
	Name string
}

type GemEffect struct {
	Zh string
	En string
}
