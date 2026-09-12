function sum(data) {
    var total = 0;

    for (var i = 0; i < data.length; i++) {
        total += data[i];
    }

    return total;
}


function mean(data) {
    if (data.length == 0) {
        return 0;
    }

    return sum(data) / data.length;
}


/*
 * Calculate minimum, maximum and average
 * for an array of numerical data.
 *
 * This function is used by the visualisations
 * that need summary statistics.
 */
function calculateStats(data) {

    if (data.length == 0) {
        return {
            min: 0,
            max: 0,
            mean: 0
        };
    }

    var minimum = data[0];
    var maximum = data[0];

    for (var i = 0; i < data.length; i++) {

        if (data[i] < minimum) {
            minimum = data[i];
        }

        if (data[i] > maximum) {
            maximum = data[i];
        }
    }

    return {
        min: minimum,
        max: maximum,
        mean: mean(data)
    };
}


/*
 * Convert an array of strings into numbers.
 */
function stringsToNumbers(data) {

    var numbers = [];

    for (var i = 0; i < data.length; i++) {
        numbers.push(Number(data[i]));
    }

    return numbers;
}


/*
 * Return a slice of row numbers from a p5.Table.
 */
function sliceRowNumbers(data, start, end) {

    var numbers = [];

    for (var i = start; i < end; i++) {
        numbers.push(data.getNum(i, 0));
    }

    return numbers;
}


/*
 * Map a value from one range to another.
 */
function mapValue(value, min1, max1, min2, max2) {

    return map(
        value,
        min1,
        max1,
        min2,
        max2
    );
}
