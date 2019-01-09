function compareStrings (a, b, direction) {
    if (!a && !b) {
        return 0;
    }
    if ((!a && direction === 'ASC') || (!b && direction === 'DESC')) {
        return 1;
    }
    if ((!b && direction === 'ASC') || (!a && direction === 'DESC')) {
        return -1;
    }

    const result = a.localeCompare(b, {}, {numeric: true, sensitivity: 'base'});
    if (direction === 'ASC' || !direction) {
        return result;
    } else if (direction === 'DESC') {
        return ~result + 1;
    }
}

function compareNumbers (a, b, direction) {
    const aIsValid = typeof a === 'number' && !isNaN(a);
    const bIsValid = typeof b === 'number' && !isNaN(b);
    if (!aIsValid && !bIsValid) {
        return 0;
    }
    if ((!aIsValid && direction === 'ASC') || (!bIsValid && direction === 'DESC')) {
        return 1;
    }
    if ((!bIsValid && direction === 'ASC') || (!aIsValid && direction === 'DESC')) {
        return -1;
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

function sortByComparator (arr, compare) {
    let length = arr.length;
    if (length < 2) {
        return arr;
    }

    let middle = Math.floor(length / 2);

    return quickSortByComparator(
        sortByComparator(arr.slice(0, middle), compare),
        sortByComparator(arr.slice(middle, length), compare),
        compare
    );
}

function quickSortByComparator (leftArray, rightArray, compare) {
    let result = [];

    while (leftArray.length > 0 || rightArray.length > 0) {
        if (leftArray.length > 0 && rightArray.length > 0) {
            if (compare(leftArray[0], rightArray[0]) <= 0) {
                result.push(leftArray[0]);
                leftArray = leftArray.slice(1);
            } else {
                result.push(rightArray[0]);
                rightArray = rightArray.slice(1);
            }
        } else if (leftArray.length > 0) {
            result.push(leftArray[0]);
            leftArray = leftArray.slice(1);
        } else if (rightArray.length > 0) {
            result.push(rightArray[0]);
            rightArray = rightArray.slice(1);
        }
    }
    return result;
}

const htmlTagRegEx = /<\/?[\w\s="/.':;#-/?]+>/gi;

function getClearText (text) {
    return String(text).replace(htmlTagRegEx, '');
}

function searchStringToRegExp (str) {
    let trimmed = str.trim();
    let escaped;

    if (trimmed.length === 0) {
        return null;
    }

    escaped = trimmed
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .replace(/\s+/g, ')(.*?\\s+.*?)(');

    return new RegExp('(.*?)(' + escaped + ')(.*?)', 'gi');
}

function intersection (...array) {
    if (!array.length) return [];
        
    var result = [];
    var arrLen = array.length;

    for (var i = 0, length = array[0].length; i < length; i++) {
        var item = array[0][i];
        if (result.indexOf(item) !== -1) continue;

        var j;
        for (j = 1; j < arrLen; j++) {
        if (array[j].indexOf(item) === -1) break;
        }
        
        if (j === arrLen) {
        result.push(item)
        }
    }
    return result;
}

export {
    compareStrings,
    compareNumbers,
    sortByComparator,
    getClearText,
    searchStringToRegExp,
    intersection
}
