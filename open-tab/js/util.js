// adds https to links before opening them
function windowOpen(url) {
    if (url === "") return;
    if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
    }
    return window.open(url, "_blank");
}

function ordinalSuffixOf(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
