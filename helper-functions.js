function sum(data) {
  var total = 0;
  data = stringsToNumbers(data);
  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }
  return total;
}

function mean(data) {
  var total = sum(data);
  return total / data.length;
}

function sliceRowNumbers(row, start = 0, end) {
  var rowData = [];
  if (!end) end = row.arr.length;
  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }
  return rowData;
}

function stringsToNumbers(array) {
  return array.map(Number);
}

function drawAxis(layout, colour = 0) {
  stroke(color(colour));
  line(
    layout.leftMargin,
    layout.bottomMargin,
    layout.rightMargin,
    layout.bottomMargin
  );
  line(
    layout.leftMargin,
    layout.topMargin,
    layout.leftMargin,
    layout.bottomMargin
  );
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  text(
    xLabel,
    (layout.plotWidth() / 2) + layout.leftMargin,
    layout.bottomMargin + (layout.marginSize * 1.5)
  );

  push();

  translate(
    layout.leftMargin - (layout.marginSize * 1.5),
    layout.bottomMargin / 2
  );

  rotate(-PI / 2);

  text(yLabel, 0, 0);

  pop();
}

function drawYAxisTickLabels(
  min,
  max,
  layout,
  mapFunction,
  decimalPlaces
) {
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    text(
      value.toFixed(decimalPlaces),
      layout.leftMargin - layout.pad,
      y
    );

    if (layout.grid) {
      stroke(200);
      line(
        layout.leftMargin,
        y,
        layout.rightMargin,
        y
      );
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  text(
    value,
    x,
    layout.bottomMargin + layout.marginSize / 2
  );

  if (layout.grid) {
    stroke(220);
    line(
      x,
      layout.topMargin,
      x,
      layout.bottomMargin
    );
  }
}


/* Start - own code */

function calculateStats(data) {
  if (data.length == 0) {
    return {
      min: 0,
      max: 0,
      mean: 0
    };
  }

  data = stringsToNumbers(data);

  var minimum = data[0];
  var maximum = data[0];

  for (var i = 1; i < data.length; i++) {
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

/* End - own code */
