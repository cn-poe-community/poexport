package main

import (
	"dbutils/pkg/config"
	"dbutils/pkg/desc"
	"dbutils/pkg/gem"
	"dbutils/pkg/stat"
	"dbutils/pkg/utils/errorutil"
	"dbutils/pkg/utils/fileutil"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var statDescriptionsPath = "metadata/statdescriptions/stat_descriptions.txt"
var passiveSkillStatDescsPath = "metadata/statdescriptions/passive_skill_stat_descriptions.txt"
var tinctureStatDescsPath = "metadata/statdescriptions/tincture_stat_descriptions.txt"

var statDescriptionsFile string
var passiveSkillStatDescsFile string
var tinctureStatDescsFile string
var txStatDescriptionsFile string
var txPassiveSkillStatDescsFile string
var txTinctureStatDescsFile string

var indexableSupportGemsFile string
var indexableSkillGemsFile string
var txIndexableSupportGemsFile string
var txIndexableSkillGemsFile string

var descFile string

func init() {
	c := config.LoadConfig("../config.json")
	statDescriptionsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", statDescriptionsPath)
	passiveSkillStatDescsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", passiveSkillStatDescsPath)
	tinctureStatDescsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", tinctureStatDescsPath)
	txStatDescriptionsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", statDescriptionsPath)
	txPassiveSkillStatDescsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", passiveSkillStatDescsPath)
	txTinctureStatDescsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", tinctureStatDescsPath)

	indexableSupportGemsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", "data/indexablesupportgems.dat64.json")
	indexableSkillGemsFile = filepath.Join(c.ProjectRoot, "docs/ggpk", "data/indexableskillgems.dat64.json")
	txIndexableSupportGemsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", "data/simplified chinese/indexablesupportgems.dat64.json")
	txIndexableSkillGemsFile = filepath.Join(c.ProjectRoot, "docs/ggpk/tx", "data/simplified chinese/indexableskillgems.dat64.json")

	descFile = filepath.Join(c.ProjectRoot, "assets/stats/desc.json")
}

func CreateStats() {
	statDescsContent := fileutil.ReadUtf16Lb(statDescriptionsFile)
	zhStatDescsContent := fileutil.ReadUtf16Lb(txStatDescriptionsFile)

	statDescsContent = hackEnStatDescContent(statDescsContent)
	zhStatDescsContent = hackZhStatDescContent(zhStatDescsContent)

	descs := desc.Load(strings.Split(statDescsContent, "\r\n"), strings.Split(zhStatDescsContent, "\r\n"))

	passiveSkillStatDescsContent := fileutil.ReadUtf16Lb(passiveSkillStatDescsFile)
	zhPassiveSkillStatDescsContent := fileutil.ReadUtf16Lb(txPassiveSkillStatDescsFile)

	passiveSkillDescs := desc.Load(strings.Split(passiveSkillStatDescsContent, "\r\n"), strings.Split(zhPassiveSkillStatDescsContent, "\r\n"))

	descs = append(descs, passiveSkillDescs...)

	tinctureStatDescsContent := fileutil.ReadUtf16Lb(tinctureStatDescsFile)
	zhTinctureStatDescsContent := fileutil.ReadUtf16Lb(txTinctureStatDescsFile)

	tinctureDescs := desc.Load(strings.Split(tinctureStatDescsContent, "\r\n"), strings.Split(zhTinctureStatDescsContent, "\r\n"))

	descs = append(descs, tinctureDescs...)

	descs = removeSkipedDesc(descs)
	hackDescs(descs)

	stats := desc.ToStats(descs)

	stats = appendRandomIndexableSupportStats(stats)
	stats = appendRandomIndexableSkillStats(stats)

	checkDuplicateZh(stats)

	data, err := json.MarshalIndent(stats, "", "  ")
	errorutil.QuitIfError(err)

	os.WriteFile(descFile, data, 0o666)
}

var hackEnStatDescContentEntries = [][2]string{
	{`#|60 "Gain {0} Vaal Soul Per Second during effect" per_minute_to_per_second 1`,
		`60 "Gain {0} Vaal Soul Per Second during effect" per_minute_to_per_second 1`},
	{`1|# "[DNT] Area contains {0} additional Common Chest Marker"`,
		`1 "[DNT] Area contains {0} additional Common Chest Marker"`},
	{`10 "Freezes inflicted on you spread to Enemies within {0} metre"` + "\r\n",
		`10 "Freezes inflicted on you spread to Enemies within {0} metre" locations_to_metres 1` + "\r\n"},
}

func hackEnStatDescContent(content string) string {
	for _, entry := range hackEnStatDescContentEntries {
		if strings.Contains(content, entry[0]) {
			content = strings.ReplaceAll(content, entry[0], entry[1])
		} else {
			log.Printf("hack missed: %v", entry[0])
		}
	}
	return content
}

var hackZhStatDescContentEntries = [][2]string{
	{`#|60 "生效期间每秒获得 {0} 个瓦尔之灵" per_minute_to_per_second 1`,
		`60 "生效期间每秒获得 {0} 个瓦尔之灵" per_minute_to_per_second 1`},
	{`#|-1 "能量护盾全满状态下防止{0:+d}%的被压制法术伤害" reminderstring ReminderTextSuppression`,
		`#|-1 "能量护盾全满状态下防止{0:+d}%的被压制法术伤害的总量" reminderstring ReminderTextSuppression`},
	{`#|-1 "枯萎技能会使干扰持续时间延长 {0}%" negate 1`,
		`#|-1 "枯萎技能会使干扰持续时间缩短 {0}%" negate 1`},
	{`#|-1 "【寒霜爆】技能会使减益效果的持续时间延长 {0}%" negate 1`,
		`#|-1 "【寒霜爆】技能会使减益效果的持续时间缩短 {0}%" negate 1`},
	{`#|-1 "每 10 秒获得 {0}% 的元素伤害增益，持续 4 秒" negate 1`,
		`#|-1 "每 10 秒获得 {0}% 的元素伤害减益，持续 4 秒" negate 1`},
	{`#|-1 "若腐化，则全域暴击率提高 {0}%" negate 1 reminderstring ReminderTextIfItemCorrupted`,
		`#|-1 "若腐化，则全域暴击率降低 {0}%" negate 1 reminderstring ReminderTextIfItemCorrupted`},
	{`1|# "[DNT]该区域会额外出现{0}个普通宝箱标记"`,
		`1 "[DNT]该区域会额外出现{0}个普通宝箱标记"`},
	{"\t1\r\n\t\t# \"图腾放置速度加快 {0}%\"\r\n",
		"\t2\r\n\t\t1|# \"图腾放置速度加快 {0}%\"\r\n#|-1 \"图腾放置速度减慢 {0}%\"\r\n"},
	{"\t\t1|# \"若你近期内有击败敌人，则效果区域扩大 {0}%，最多 50%\" reminderstring ReminderTextRecently\r\n\t\t#|-1 \"若你近期内有击败敌人，则效果区域缩小 {0}%\" negate 1  reminderstring ReminderTextRecently\r\n",
		"\t\t1|# \"若你近期内有击败敌人，则效果区域扩大 {0}%，最多 50%\" reminderstring ReminderTextRecently\r\n\t\t#|-1 \"若你近期内有击败敌人，则效果区域缩小 {0}%，最多 50%\" negate 1  reminderstring ReminderTextRecently\r\n"},
	{`1 "【毒雨】可以额外发射 1 个箭矢"`,
		`1 "【毒雨】可以额外发射 {0} 个箭矢"`},
	{`1|# "如果诅咒持续时间已经过去 25%，\n则你诅咒的敌人的移动速度被减缓 25%"`,
		`1|# "如果诅咒持续时间已经过去 25%，\n则你诅咒的敌人的移动速度被减缓 {0}%"`},
	{`10 "对你造成的冻结会扩散给 {0} 米内的其他敌人"` + "\r\n",
		`10 "对你造成的冻结会扩散给 {0} 米内的其他敌人" locations_to_metres 1` + "\r\n"},
}

func hackZhStatDescContent(content string) string {
	for _, entry := range hackZhStatDescContentEntries {
		if strings.Contains(content, entry[0]) {
			content = strings.ReplaceAll(content, entry[0], entry[1])
		} else {
			log.Printf("hack missed: %v", entry[0])
		}
	}
	return content
}

func hackDescs(descs []*desc.Desc) {
	for _, d := range descs {
		// 血影的`每个狂怒球可使攻击速度减慢 4%`，应当为`每个狂怒球可使攻击和施法速度减慢 4%`
		// 与`每个狂怒球可使攻击速度加快 {0}%`,`每个狂怒球可使攻击速度减慢 {0}%`冲突
		// 需要translator进行hack
		if d.Id == "attack_and_cast_speed_+%_per_frenzy_charge" {
			if d.Texts[desc.LangZh][0].Template == "每个狂怒球可使攻击速度加快 {0}%" {
				d.Texts[desc.LangZh][0].Template = "每个狂怒球可使攻击和施法速度加快 {0}%"
			} else {
				log.Panicf("hack missed: %v", d.Id)
			}
			if d.Texts[desc.LangZh][1].Template == "每个狂怒球可使攻击速度减慢 {0}%" {
				d.Texts[desc.LangZh][1].Template = "每个狂怒球可使攻击和施法速度减慢 {0}%"
			} else {
				log.Panicf("hack missed: %v", d.Id)
			}
			continue
		}

		// 戴亚迪安的晨曦的`没有物理伤害`，应当为`不造成物理伤害`
		// 与武器上的`没有物理伤害`词缀产生冲突
		// 受影响物品：戴亚迪安的晨曦，异度天灾武器基底词缀
		// 需要translator进行hack
		if d.Id == "base_deal_no_physical_damage" {
			if d.Texts[desc.LangZh][0].Template == "没有物理伤害" {
				d.Texts[desc.LangZh][0].Template = "不造成物理伤害"
			}
		}

		// 最新引入的bug，中文词缀重复出现
		if len(d.Texts[desc.LangZh]) > len(d.Texts[desc.LangEn]) {
			zhTextsLen := len(d.Texts[desc.LangZh])
			if zhTextsLen%2 == 0 {
				zhTexts := d.Texts[desc.LangZh]
				i, j := 0, zhTextsLen/2
				for j < zhTextsLen {
					if zhTexts[i].Template != zhTexts[j].Template || zhTexts[i].ParamsStr != zhTexts[j].ParamsStr {
						break
					}
					j++
					i++
				}

				if j == zhTextsLen {
					d.Texts[desc.LangZh] = zhTexts[:zhTextsLen/2]
				}
			}
		}
	}
}

var skipedDescIds = map[string]bool{
	// 中文相同英文不同，是地图词缀
	"map_projectile_speed_+%":                     true,
	"map_players_gain_soul_eater_on_rare_kill_ms": true,
	// 中文相同英文不同，是局部词缀
	"local_gem_experience_gain_+%": true,
	"local_accuracy_rating_+%":     true,
	// 中文相同英文不同，是技能说明
	"skill_range_+%": true,
	// 中文相同英文不同，是无效词缀
	"elemental_damage_taken_+%_during_flask_effect": true,
	"global_poison_on_hit":                          true,
	"bleed_on_melee_critical_strike":                true,
	// 中文相同英文不同，但是英文均为有效词缀
	"curse_on_hit_level_warlords_mark":                        true,
	"damage_taken_+%_if_you_have_taken_a_savage_hit_recently": true,
	"immune_to_bleeding":                                      true,
	"onslaught_buff_duration_on_kill_ms":                      true,
	// 中文相同英文不同，不知道正确词缀
	// 【断金之刃】的伤害提高，【断金之刃】的伤害降低
	"shattering_steel_damage_+%": true,
	"lancing_steel_damage_+%":    true,
}

func removeSkipedDesc(descs []*desc.Desc) []*desc.Desc {
	newDescs := make([]*desc.Desc, 0, len(descs))
	for _, d := range descs {
		if !skipedDescIds[d.Id] &&
			!strings.HasPrefix(d.Id, "map_") {
			newDescs = append(newDescs, d)
		}
	}

	return newDescs
}

var randomIndexableSupportStatId1 = "local_random_support_gem_level local_random_support_gem_index"
var randomIndexableSupportStatId2 = "local_random_support_gem_level_1 local_random_support_gem_index_1"

func appendRandomIndexableSupportStats(stats []*stat.Stat) []*stat.Stat {
	newStats := make([]*stat.Stat, 0, len(stats))

	matched := false
	for _, stat := range stats {
		if stat.Id == randomIndexableSupportStatId1 || stat.Id == randomIndexableSupportStatId2 {
			if stat.Zh == "插入的技能石被 {0} 级的【{1}】辅助" && stat.En == "Socketed Gems are Supported by Level {0} {1}" {
				matched = true
			} else {
				log.Fatal("random indexable support stats template changed")
			}
		} else {
			newStats = append(newStats, stat)
		}
	}

	if !matched {
		log.Println("warning: no template of random indexable support stats")
		return stats
	}

	indexableSupportGems := gem.LoadIndexableSupportGemsFromGgpk(indexableSupportGemsFile, txIndexableSupportGemsFile)
	for _, gem := range indexableSupportGems {
		newStats = append(newStats, &stat.Stat{
			Id: randomIndexableSupportStatId1,
			Zh: fmt.Sprintf("插入的技能石被 {0} 级的【%s】辅助", gem.Zh),
			En: fmt.Sprintf("Socketed Gems are Supported by Level {0} %s", gem.En),
		})
	}

	return newStats
}

var randomIndexableSkillStatId = "random_skill_gem_level_+_level random_skill_gem_level_+_index"

func appendRandomIndexableSkillStats(stats []*stat.Stat) []*stat.Stat {
	newStats := make([]*stat.Stat, 0, len(stats))

	matched := false
	for _, stat := range stats {
		if stat.Id == randomIndexableSkillStatId {
			if stat.Zh == "所有 {1} 宝石等级 +{0}" && stat.En == "+{0} to Level of all {1} Gems" ||
				stat.Zh == "所有 {1} 宝石等级 -{0}" && stat.En == "-{0} to Level of all {1} Gems" {
				matched = true
			} else {
				log.Fatal("random indexable support stats template changed")
			}
		} else {
			newStats = append(newStats, stat)
		}
	}

	if !matched {
		log.Println("warning: no template of random indexable support stats")
		return stats
	}

	indexableSkillGems := gem.LoadIndexableSkillGemsFromGgpk(indexableSkillGemsFile, txIndexableSkillGemsFile)
	for _, gem := range indexableSkillGems {
		newStats = append(newStats, &stat.Stat{
			Id: randomIndexableSkillStatId,
			Zh: fmt.Sprintf("所有 %s 宝石等级 +{0}", gem.Zh),
			En: fmt.Sprintf("+{0} to Level of all %s Gems", gem.En),
		})
		newStats = append(newStats, &stat.Stat{
			Id: randomIndexableSkillStatId,
			Zh: fmt.Sprintf("所有 %s 宝石等级 -{0}", gem.Zh),
			En: fmt.Sprintf("-{0} to Level of all %s Gems", gem.En),
		})
	}

	return newStats
}

func checkDuplicateZh(stats []*stat.Stat) {
	records := map[string]string{}

	for _, stat := range stats {
		if recordEn, ok := records[stat.Zh]; ok {
			if !strings.EqualFold(recordEn, stat.En) {
				log.Printf("warning diff en of: %v", stat.Zh)
				log.Print(recordEn)
				log.Print(stat.En)
			}
		} else {
			records[stat.Zh] = stat.En
		}
	}
}

/*
 * 从ggpk中提取需要的文件，解析文件，hack解析结果，生成最终的词缀数据库文件。
 *
 */
func main() {
	CreateStats()
}
