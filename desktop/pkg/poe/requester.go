package poe

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
)

const txPoeForumHost = "poe.game.qq.com"
const getCharactersPath = "/character-window/get-characters"
const getPassiveSkillsPath = "/character-window/get-passive-skills"
const getItemsPath = "/character-window/get-items"

var txPoeForumUrl, _ = url.Parse("https://" + txPoeForumHost)
var getCharactersUrl = txPoeForumUrl.JoinPath(getCharactersPath)
var getPassiveSkillsUrl = txPoeForumUrl.JoinPath(getPassiveSkillsPath)
var getItemsUrl = txPoeForumUrl.JoinPath(getItemsPath)

const poeSessIdName = "POESESSID"

var ErrUnauthorized = errors.New("POESESSID已失效，请更新")
var ErrGetCharactersForbidden = errors.New("你查看的用户不存在或已隐藏")
var ErrRateLimit = errors.New("请求过于频繁，请稍后再试")

type PoeClient struct {
	client http.Client
}

func NewPoeClient(poeSessId string) (*PoeClient, error) {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}

	poeClient := &PoeClient{
		client: http.Client{
			Jar: jar,
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				return http.ErrUseLastResponse
			},
		},
	}

	cookies := []*http.Cookie{{Name: poeSessIdName, Value: poeSessId}}
	poeClient.client.Jar.SetCookies(txPoeForumUrl, cookies)

	return poeClient, nil
}

func (c *PoeClient) GetCharacters(accountName, realm string) (string, error) {
	form := url.Values{}
	form.Add("accountName", accountName)
	form.Add("realm", realm)
	resp, err := c.client.PostForm(getCharactersUrl.String(), form)
	if err != nil {
		return "", err
	}
	data, err := io.ReadAll(resp.Body)

	if resp.StatusCode == 401 {
		return "", ErrUnauthorized
	}
	if resp.StatusCode == 403 {
		return "", ErrGetCharactersForbidden
	}
	if resp.StatusCode == 429 {
		return "", ErrRateLimit
	}
	if resp.StatusCode != 200 {
		return "", fmt.Errorf("未预期的HTTP响应码: %d", resp.StatusCode)
	}

	return string(data), err
}

func (c *PoeClient) GetItems(accountName, character, realm string) (string, error) {
	form := url.Values{}
	form.Add("accountName", accountName)
	form.Add("character", character)
	form.Add("realm", realm)
	resp, err := c.client.PostForm(getItemsUrl.String(), form)
	if err != nil {
		return "", err
	}
	data, err := io.ReadAll(resp.Body)

	if resp.StatusCode == 401 {
		return "", ErrUnauthorized
	}
	if resp.StatusCode == 403 {
		return "", ErrGetCharactersForbidden
	}
	if resp.StatusCode == 429 {
		return "", ErrRateLimit
	}
	if resp.StatusCode != 200 {
		return "", fmt.Errorf("未预期的HTTP响应码: %d", resp.StatusCode)
	}

	return string(data), err
}

func (c *PoeClient) GetPassiveSkills(accountName, character, realm string) (string, error) {
	form := url.Values{}
	form.Add("accountName", accountName)
	form.Add("character", character)
	form.Add("realm", realm)
	resp, err := c.client.PostForm(getPassiveSkillsUrl.String(), form)
	if err != nil {
		return "", err
	}
	data, err := io.ReadAll(resp.Body)

	if resp.StatusCode == 401 {
		return "", ErrUnauthorized
	}
	if resp.StatusCode == 403 {
		return "", ErrGetCharactersForbidden
	}
	if resp.StatusCode == 429 {
		return "", ErrRateLimit
	}
	if resp.StatusCode != 200 {
		return "", fmt.Errorf("未预期的HTTP响应码: %d", resp.StatusCode)
	}

	return string(data), err
}
