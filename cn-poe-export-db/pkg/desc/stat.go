package desc

import (
	"dbutils/pkg/stat"
	"fmt"
	"log"
	"math"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

func (t *Text) hasFixedParam() bool {
	for _, p := range t.Params {
		if p.Matcher.from == p.Matcher.to {
			return true
		}
	}
	return false
}

func (t *Text) fillFixedParamToTemplate() string {
	tmpl := t.Template
	for i, p := range t.Params {
		if p.Matcher.from == p.Matcher.to {
			val := p.Matcher.from
			if p.Props["milliseconds_to_seconds"] ||
				p.Props["milliseconds_to_seconds_0dp"] ||
				p.Props["milliseconds_to_seconds_2dp_if_required"] {
				val /= 1000
			} else if p.Props["per_minute_to_per_second"] {
				val /= 60
			} else if p.Props["locations_to_metres"] {
				val /= 10
			}

			if p.Props["negate"] {
				val *= -1
			}

			if !(val == 1 || val == -1 || val == 0) {
				log.Printf("warning: param val may be wrong: %d, of: %s", val, t.Template)
			}

			tmpl = strings.ReplaceAll(tmpl, fmt.Sprintf("{%d}", i), strconv.Itoa(val))
			tmpl = strings.ReplaceAll(tmpl, fmt.Sprintf("{%d:d}", i), strconv.Itoa(val))
			tmpl = strings.ReplaceAll(tmpl, fmt.Sprintf("{%d:+d}", i), fmt.Sprintf("%+d", val))
			tmpl = strings.ReplaceAll(tmpl, fmt.Sprintf("{%d:+}", i), fmt.Sprintf("%+d", val))
		}
	}
	return tmpl
}

func (t *Text) getFixedRangeParamCount() int {
	count := 0
	for _, p := range t.Params {
		if p.Matcher.from > math.MinInt && p.Matcher.to < math.MaxInt {
			count++
		}
	}
	return count
}

func ToStats(descs []*Desc) []*stat.Stat {
	stats := []*stat.Stat{}
	for _, desc := range descs {
		enTexts := desc.Texts[LangEn]
		zhTexts := desc.Texts[LangZh]

		if len(enTexts) != len(zhTexts) {
			log.Printf("warning: diff texts len of zh and en: %v", desc.Id)
		}

		for i, zhText := range zhTexts {
			enText := enTexts[i]
			nextTextLocation := findNextTextWithTheSameTemplate(zhTexts, i)
			if nextTextLocation > 0 {
				nextEnText := enTexts[nextTextLocation]
				if enText.Template == nextEnText.Template {
					continue
				}

				if len(enText.Params) == 0 {
					log.Fatalf("unexpected situtation of: %v", zhText.Template)
				}

				if enText.hasFixedParam() {
					stats = append(stats, &stat.Stat{
						Id: desc.Id,
						Zh: zhText.fillFixedParamToTemplate(),
						En: enText.fillFixedParamToTemplate(),
					})
					continue
				} else if enText.getFixedRangeParamCount() > 0 {
					expandStats := expandAllFixedRangeParams(zhText, enText)
					for _, s := range expandStats {
						s.Id = desc.Id
					}
					stats = append(stats, expandStats...)
					continue
				} else {
					log.Printf(`repeated zh text in same description: %v`, zhText.Template)
				}
			}

			stats = append(stats, &stat.Stat{
				Id: desc.Id,
				Zh: zhText.Template,
				En: enText.Template,
			})
		}
	}

	for _, stat := range stats {
		formatStat(stat)
	}

	return stats
}

func findNextTextWithTheSameTemplate(texts []*Text, curr int) int {
	if curr == len(texts) {
		return -1
	}

	tmpl := texts[curr].Template

	for i := curr + 1; i < len(texts); i++ {
		if texts[i].Template == tmpl {
			return i
		}
	}

	return -1
}

func expandAllFixedRangeParams(zhText, enText *Text) []*stat.Stat {
	positions := []int{}
	backups := []*ParamMatcher{}
	for i, p := range zhText.Params {
		if p.Matcher.from > math.MinInt && p.Matcher.to < math.MaxInt {
			positions = append(positions, i)
			backups = append(backups, p.Matcher)
			zhText.Params[i].Matcher = &ParamMatcher{
				from: p.Matcher.from,
				to:   p.Matcher.to,
			}
			enText.Params[i].Matcher = &ParamMatcher{
				from: p.Matcher.from,
				to:   p.Matcher.to,
			}
		}
	}

	stats := expandRemainingFixedRangeParams(zhText, enText, positions, backups)

	for i := range positions {
		backup := backups[i]
		zhText.Params[i].Matcher = &ParamMatcher{
			from: backup.from,
			to:   backup.to,
		}
		enText.Params[i].Matcher = &ParamMatcher{
			from: backup.from,
			to:   backup.to,
		}
	}

	return stats
}

func expandRemainingFixedRangeParams(zhText, enText *Text, positions []int, ranges []*ParamMatcher) []*stat.Stat {
	if len(positions) == 0 {
		return []*stat.Stat{{
			Zh: zhText.fillFixedParamToTemplate(),
			En: enText.fillFixedParamToTemplate(),
		}}
	}

	stats := []*stat.Stat{}
	min := ranges[0].from
	max := ranges[0].to

	for n := min; n <= max; n++ {
		zhText.Params[positions[0]].Matcher.from = n
		zhText.Params[positions[0]].Matcher.to = n
		enText.Params[positions[0]].Matcher.from = n
		enText.Params[positions[0]].Matcher.to = n
		stats = append(stats, expandRemainingFixedRangeParams(zhText, enText, positions[1:], ranges[1:])...)
	}
	return stats
}

func formatStat(stat *stat.Stat) {
	re := regexp.MustCompile(`{(\d+):\+?d}`)
	stat.Zh = re.ReplaceAllString(stat.Zh, "{${1}}")
	stat.En = re.ReplaceAllString(stat.En, "{${1}}")
	relocateParamNums(stat)
}

func relocateParamNums(stat *stat.Stat) {
	zhParamNumSet := map[int]bool{}
	enParamNumSet := map[int]bool{}

	re := regexp.MustCompile(`{(\d+?)}`)
	unlimited := -1
	matches := re.FindAllStringSubmatch(stat.Zh, unlimited)
	for _, match := range matches {
		num, _ := strconv.Atoi(match[1])
		zhParamNumSet[num] = true
	}

	matches = re.FindAllStringSubmatch(stat.En, unlimited)
	for _, match := range matches {
		num, _ := strconv.Atoi(match[1])
		enParamNumSet[num] = true
	}

	//only check missed param nums of zh --> en
	for enParamNum := range enParamNumSet {
		if _, ok := zhParamNumSet[enParamNum]; !ok {
			log.Printf("warning: en of %s needs more params", stat.Id)
			log.Print(stat.Zh)
			log.Print(stat.En)
		}
	}

	if len(zhParamNumSet) == 0 {
		return
	}

	zhParamNums := make([]int, 0, len(zhParamNumSet))
	for zhParamNum := range zhParamNumSet {
		zhParamNums = append(zhParamNums, zhParamNum)
	}

	sort.Ints(zhParamNums)
	if zhParamNums[len(zhParamNums)-1] == len(zhParamNums)-1 {
		return
	}

	zh := stat.Zh
	en := stat.En
	for newNum, num := range zhParamNums {
		old := fmt.Sprintf("{%d}", num)
		replacement := fmt.Sprintf("{%d}", newNum)
		zh = strings.ReplaceAll(zh, old, replacement)
		en = strings.ReplaceAll(en, old, replacement)
	}

	stat.Zh = zh
	stat.En = en
}
