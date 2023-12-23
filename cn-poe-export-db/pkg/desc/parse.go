package desc

import (
	"fmt"
	"log"
	"math"
	"regexp"
	"strconv"
	"strings"
)

const (
	descTagReaded = iota
	languageReaded
	lineCountReaded
	textsReaded
)

const LangEn = "English"
const LangZh = "Simplified Chinese"

type Desc struct {
	ParamCount int
	Id         string
	Texts      map[string][]*Text
}

type Text struct {
	ParamsStr string
	Params    []*Param
	Template  string
	Props     map[string]bool
}

type Param struct {
	Matcher *ParamMatcher
	Props   map[string]bool
}

type ParamMatcher struct {
	from     int
	to       int
	isNot    bool
	notValue int
}

type Prop struct {
	name     string
	targetId int
}

func Parse(lines []string) []*Desc {
	status := textsReaded
	var descs []*Desc
	var currDesc *Desc = nil
	currLang := ""
	textCount := 0
	for i, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "no_description") || strings.HasPrefix(line, "include") {
			continue
		}

		switch status {
		case descTagReaded:
			currDesc.ParamCount, currDesc.Id = parseParamDescs(line)
			currLang = LangEn
			status = languageReaded
		case languageReaded:
			var err error
			textCount, err = strconv.Atoi(line)
			if err != nil {
				log.Fatalf("expected line count, but got: %s", line)
			}
			status = lineCountReaded
		case lineCountReaded:
			text := parseText(line)
			currDesc.Texts[currLang] = append(currDesc.Texts[currLang], text)
			textCount--
			if textCount == 0 {
				status = textsReaded
			}
		case textsReaded:
			if strings.HasPrefix(line, "description") {
				currDesc = &Desc{Texts: make(map[string][]*Text)}
				descs = append(descs, currDesc)
				status = descTagReaded
			} else if strings.HasPrefix(line, "lang") {
				currLang = parseLang(line)
				status = languageReaded
			}
		default:
			log.Fatalf("unrecognized line %d: %s", i, line)
		}

	}
	return descs
}

func parseParamDescs(line string) (int, string) {
	re := regexp.MustCompile(`^(\d+)\s(.+)$`)
	m := re.FindStringSubmatch(line)
	if m == nil {
		log.Fatalf("expectd param descs, but got: %v", line)
	}
	paramCount, _ := strconv.Atoi(m[1])
	descs := m[2]
	return paramCount, descs
}

func parseText(line string) *Text {
	re := regexp.MustCompile(`^(.+)\s"(.*?)"(.*)$`)
	stat := &Text{
		Props: map[string]bool{},
	}
	m := re.FindStringSubmatch(line)
	if m == nil {
		log.Fatalf("expected text, but got: %s", line)
	}

	paramsStr := m[1]
	stat.ParamsStr = paramsStr
	pieces := strings.Split(paramsStr, " ")
	for _, str := range pieces {
		// some params strings are not formal
		// such as `1|#   0 "{0}% increased Duration"`
		if str == "" {
			continue
		}
		matcher, err := parseParamMatcher(str)
		if err != nil {
			log.Fatalf("parse line `%v` failed: %v", line, err)
		}
		stat.Params = append(stat.Params, &Param{
			Matcher: matcher,
			Props:   map[string]bool{},
		})
	}

	stat.Template = formatTemplate(m[2])

	propsStr := strings.TrimSpace(m[3])
	props := parseProps(propsStr)

	for _, prop := range props {
		if prop.targetId >= 0 {
			id := prop.targetId
			stat.Params[id].Props[prop.name] = true
		} else {
			stat.Props[prop.name] = true
		}
	}

	return stat
}

func formatTemplate(tmpl string) string {
	tmpl = strings.ReplaceAll(tmpl, `\n`, "\n")

	// change automatic field numbering to manual field numbering
	re := regexp.MustCompile("{(:.+)?}")
	index := 0
	tmpl = re.ReplaceAllStringFunc(tmpl, func(match string) string {
		m := re.FindStringSubmatch(match)
		var result string
		if len(m[1]) == 0 {
			result = fmt.Sprintf("{%d}", index)
		} else {
			result = fmt.Sprintf("{%d%s}", index, m[1])
		}
		index++
		return result
	})

	return tmpl
}

func parseParamMatcher(str string) (*ParamMatcher, error) {
	matcher := &ParamMatcher{}
	if str == "#" {
		matcher.from = math.MinInt
		matcher.to = math.MaxInt
		return matcher, nil
	}

	if strings.Contains(str, "|") {
		pieces := strings.Split(str, "|")
		from := 0
		if pieces[0] == "#" {
			from = math.MinInt
		} else {
			var err error
			from, err = strconv.Atoi(pieces[0])
			if err != nil {
				return nil, fmt.Errorf("expected range from, but got: %v", pieces[0])
			}
		}
		to := 0
		if pieces[1] == "#" {
			to = math.MaxInt
		} else {
			var err error
			to, err = strconv.Atoi(pieces[1])
			if err != nil {
				return nil, fmt.Errorf("expected range to, but got: %v", pieces[1])
			}
		}

		matcher.from = from
		matcher.to = to
		return matcher, nil
	}

	if strings.HasPrefix(str, "!") {
		num, err := strconv.Atoi(str[1:])
		if err != nil {
			return nil, fmt.Errorf("unrecognized param: %s", str)
		}

		matcher.isNot = true
		matcher.notValue = num
		return matcher, nil
	}

	num, err := strconv.Atoi(str)
	if err != nil {
		return nil, fmt.Errorf("unrecognized param: %s", str)
	}
	matcher.from = num
	matcher.to = num

	return matcher, nil
}

func parseLang(line string) string {
	re := regexp.MustCompile(`^lang\s"(.*?)"$`)
	m := re.FindStringSubmatch(line)
	if m == nil {
		log.Fatalf("expected language line, but got: %s", line)
	}
	return m[1]
}

func parseProps(str string) []*Prop {
	pieces := strings.Split(str, " ")
	re := regexp.MustCompile(`^\d+$`)
	props := []*Prop{}
	onTag := false
	for _, piece := range pieces {
		if re.MatchString(piece) {
			if !onTag {
				log.Fatalf("expected prop name, but got: %s\n", piece)
			} else {
				target, _ := strconv.Atoi(piece)
				props[len(props)-1].targetId = target - 1
				onTag = false
			}
		} else {
			tag := &Prop{
				name:     piece,
				targetId: -1,
			}
			props = append(props, tag)
			onTag = true
		}
	}

	return props
}

func Load(enDescDat []string, zhDescDat []string) []*Desc {
	enDescs := Parse(enDescDat)
	zhDescs := Parse(zhDescDat)

	descs := merge(enDescs, zhDescs)
	filterStatsByLanguages(descs, []string{LangEn, LangZh})
	return descs
}

func merge(enDescs, zhDescs []*Desc) []*Desc {
	enDescMap := map[string]*Desc{}
	for _, d := range enDescs {
		enDescMap[d.Id] = d
	}

	for _, d := range zhDescs {
		d.Texts[LangEn] = enDescMap[d.Id].Texts[LangEn]
	}

	return zhDescs
}

func filterStatsByLanguages(descs []*Desc, languages []string) {
	for _, desc := range descs {
		newStats := map[string][]*Text{}
		for _, lang := range languages {
			newStats[lang] = desc.Texts[lang]
		}
		desc.Texts = newStats
	}
}
