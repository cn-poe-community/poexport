export function escapeRegExp(str: string) {
    //https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
