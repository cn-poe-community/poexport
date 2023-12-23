package update

import (
	"fmt"
	"strconv"
	"strings"
)

type SemanticVersion struct {
	Major int
	Minor int
	Patch int
}

func NewSemanticVersion(number string) (*SemanticVersion, error) {
	pieces := strings.Split(number, ".")
	if len(pieces) != 3 {
		return nil, fmt.Errorf("invalid semantic version: %v", number)
	}

	nums := []int{}
	for _, piece := range pieces {
		n, err := strconv.Atoi(piece)
		if err != nil {
			return nil, fmt.Errorf("invalid semantic version: %v", number)
		}
		nums = append(nums, n)
	}

	return &SemanticVersion{nums[0], nums[1], nums[2]}, nil
}

func (s *SemanticVersion) LessThan(target *SemanticVersion) bool {
	return s.Major < target.Major || s.Minor < target.Minor || s.Patch < target.Patch
}

func (s *SemanticVersion) ToString() string {
	return fmt.Sprintf("%v.%v.%v", s.Major, s.Minor, s.Patch)
}

// Check if semantic version i less than semantic version j.
//
// Return error if i or j is not an effective semantic version.
func Less(v1 string, v2 string) (bool, error) {
	sv1, err := NewSemanticVersion(v1)
	if err != nil {
		return false, err
	}
	sv2, err := NewSemanticVersion(v2)
	if err != nil {
		return false, err
	}

	return sv1.LessThan(sv2), nil
}
