package update_test

import (
	"poexport/pkg/update"
	"testing"
)

func TestNewSemanticVersion(t *testing.T) {
	number := "1.0.1"
	v, err := update.NewSemanticVersion(number)
	if err != nil {
		t.Fatal(err)
	}
	if v.Major != 1 || v.Minor != 0 || v.Patch != 1 {
		t.Fatal("invalid parts of number")
	}
}
