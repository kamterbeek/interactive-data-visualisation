function PayGapTimeSeries() {

  this.name = 'Pay gap: 1997-2017';
  this.id = 'pay-gap-timeseries';

  this.title =
    'Gender Pay Gap: Average difference between male and female pay.';

  this.xAxisLabel = 'Year';
  this.yAxisLabel = 'Pay gap (%)';

  var marginSize = 35;

  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize * 2,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function() {
      return this.bottomMargin - this.topMargin;
    },

    grid: true,
    numXTickLabels: 10,
    numYTickLabels: 8
  };

  this.loaded = false;

  this.preload = function() {
    var self = this;

    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv',
      'csv',
      'header',
      function(table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function() {

    if (!this.loaded) {
      return;
    }

    textSize(16);

    this.startYear =
      this.data.getNum(0, 'year');

    this.endYear =
      this.data.getNum(
        this.data.getRowCount() - 1,
        'year'
      );

    this.minPayGap = 0;

    this.maxPayGap =
      max(
        this.data.getColumn('pay_gap')
      );
  };

  this.destroy = function() {};

  this.draw = function() {

    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    background(255);

    /* Start - own code */

    // Draw the title at the top of the graph.
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);

    text(
      this.title,
      this.layout.leftMargin,
      15
    );

    /* End - own code */


    // Draw the y-axis labels.
    drawYAxisTickLabels(
      this.minPayGap,
      this.maxPayGap,
      this.layout,
      this.mapPayGapToHeight.bind(this),
      1
    );

    // Draw the main axes.
    drawAxis(this.layout);

    /* Start - own code */

    // Draw the x and y axis titles.
    drawAxisLabels(
      this.xAxisLabel,
      this.yAxisLabel,
      this.layout
    );

    /* End - own code */


    /* Start - own code */

    // Calculate how often an x-axis label should appear.
    var numYears =
      this.endYear - this.startYear;

    var xLabelSkip =
      ceil(
        numYears /
        this.layout.numXTickLabels
      );

    // Draw the year labels along the x-axis.
    for (
      var year = this.startYear;
      year <= this.endYear;
      year += xLabelSkip
    ) {

      drawXAxisTickLabel(
        year,
        this.layout,
        this.mapYearToWidth.bind(this)
      );
    }

    /* End - own code */


    /* Start - own code */

    // Store the previous point so the data
    // can be connected into a line.
    var previous = null;

    for (
      var i = 0;
      i < this.data.getRowCount();
      i++
    ) {

      // Get the year and pay gap from the table.
      var current = {
        year: this.data.getNum(i, 'year'),
        payGap: this.data.getNum(i, 'pay_gap')
      };

      var x =
        this.mapYearToWidth(current.year);

      var y =
        this.mapPayGapToHeight(current.payGap);

      // Connect the current point to the previous point.
      if (previous != null) {
        stroke(0);
        strokeWeight(2);

        line(
          previous.x,
          previous.y,
          x,
          y
        );
      }

      // Draw a small point for each year.
      fill(0);
      stroke(0);
      strokeWeight(1);

      ellipse(
        x,
        y,
        6,
        6
      );

      previous = {
        x: x,
        y: y
      };
    }

    /* End - own code */
  };


  this.mapYearToWidth = function(value) {

    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin,
      this.layout.rightMargin
    );
  };


  this.mapPayGapToHeight = function(value) {

    /* Start - own code */

    // Convert the pay gap percentage into
    // a vertical position on the graph.
    return map(
      value,
      this.minPayGap,
      this.maxPayGap,
      this.layout.bottomMargin,
      this.layout.topMargin
    );

    /* End - own code */
  };
}
