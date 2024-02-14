const letters = '0123456789XE';

function measure(string, from_base) {
    let dotPosition = string.length;
    for (let i = 0; i < string.length; i++) {
        if (string[i] == '.') {
            dotPosition = i;
            string = string.substring(0, i) + string.substring(i+1);
            break;
        }
    }
    dotPosition = dotPosition - string.length;

    let result = 0;
    while (string.length > 0) {
        result += letters.indexOf(string[string.length-1]) * Math.pow(from_base, dotPosition);
        dotPosition++;

        string = string.substring(0, string.length-1);
    }

    return result;
}

input12.addEventListener('keyup', e => {
    let content = e.target.value
        .replaceAll(',', '')
        .toUpperCase();

    let value = measure(content, 12);
    input10.value = value.toString(10);
});

input10.addEventListener('keyup', e => {
    let content = e.target.value
        .replaceAll(',', '')
        .toUpperCase();

    let value = measure(content, 10);
    input12.value = value.toString(12)
        .replaceAll('a', 'X')
        .replaceAll('b', 'E');
});
