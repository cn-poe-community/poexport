package fileutil

import (
	"dbutils/pkg/utils/errorutil"
	"io"
	"os"

	"golang.org/x/text/encoding/unicode"
	"golang.org/x/text/transform"
)

// Read utf-16 littledian using bom file.
func ReadUtf16Lb(filename string) string {
	// https://stackoverflow.com/a/55632545/21591057
	file, err := os.Open(filename)
	errorutil.QuitIfError(err)

	unicodeReader := transform.NewReader(file, unicode.UTF16(unicode.LittleEndian, unicode.UseBOM).NewDecoder())
	bytes, err := io.ReadAll(unicodeReader)
	errorutil.QuitIfError(err)

	return string(bytes)
}
