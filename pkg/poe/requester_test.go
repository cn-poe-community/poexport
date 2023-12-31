package poe_test

import (
	"os"
	"poexport/pkg/poe"
	"strings"
	"testing"
)

var poeSessId = os.Getenv("poesessid")

func TestGetCharacters(t *testing.T) {
	poeClient, err := poe.NewPoeClient(poeSessId)
	if err != nil {
		t.Fatal(err)
	}

	user := "盲将盲将"
	character := "B站高远寒_S24"

	data, err := poeClient.GetCharacters(user, "pc")
	if err != nil {
		t.Fatal(err)
	}

	if !strings.Contains(data, character) {
		t.Fatalf("no matched user %v of %v", character, user)
	}
}

func TestGetItems(t *testing.T) {
	poeClient, err := poe.NewPoeClient(poeSessId)
	if err != nil {
		t.Fatal(err)
	}

	user := "盲将盲将"
	character := "B站高远寒_S24"

	data, err := poeClient.GetItems(user, character, "pc")
	if err != nil {
		t.Fatal(err)
	}

	if !strings.Contains(data, character) {
		t.Fatalf("wrong returned data: %v", data)
	}
}

func TestGetPassiveSkills(t *testing.T) {
	poeClient, err := poe.NewPoeClient(poeSessId)
	if err != nil {
		t.Fatal(err)
	}

	user := "盲将盲将"
	character := "B站高远寒_S24"

	data, err := poeClient.GetPassiveSkills(user, character, "pc")
	if err != nil {
		t.Fatal(err)
	}

	if !strings.Contains(data, "mastery_effects") {
		t.Fatalf("wrong returned data: %v", data)
	}
}
