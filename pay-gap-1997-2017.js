function PayGapTimeSeries() {

    this.name = 'Pay gap: 1997-2017';
    this.id = 'pay-gap-timeseries';

    this.title =
        'Gender Pay Gap: Average difference between male and female pay.';

    this.xAxisLabel = 'year';
    this.yAxisLabel = 'Pay gap (%)';

    // Layout settings.
    var marginSize = 35;

    this.layout = {
        marginSize: marginSize,

        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
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

    // Data loading status.
    this.loaded = false;


    // ---------------------------------------------------------------
    // Load data
    // ---------------------------------------------------------------

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


    // ---------------------------------------------------------------
    // Setup
    // ---------------------------------------------------------------

    this.setup = function() {

        if (!this.loaded) {
            return;
        }

        textSize(16);

        // First and last years in the dataset.
        this.startYear =
            this.data.getNum(0, 'year');

        this.endYear =
            this.data.getNum(
                this.data.getRowCount() - 1,
                'year'
            );

        // Pay equality is represented by 0%.
        this.minPayGap = 0;

        this.maxPayGap =
            max(this.data.getColumn('pay_gap'));
    };


    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    this.destroy = function() {
        // Nothing needs to be removed for this visualisation.
    };


    // ---------------------------------------------------------------
    // Draw
    // ---------------------------------------------------------------

    this.draw = function() {

        if (!this.loaded) {
            return;
        }

        background(255);

        // Title.
        fill(0);
        noStroke();

        textSize(20);
        textAlign('left', 'top');

        text(
            this.title,
            this.layout.leftMargin,
            15
        );


        // Draw axes.
        drawAxis(this.layout);

        drawAxisLabels(
            this.xAxisLabel,
            this.yAxisLabel,
            this.layout
        );


        // Draw y-axis tick labels.
        drawYAxisTickLabels(
            this.minPayGap,
            this.maxPayGap,
            this.layout,
            this.mapPayGapToHeight.bind(this),
            1
        );


        // Draw x-axis tick labels.
        var yearStep =
            (this.endYear - this.startYear) /
            this.layout.numXTickLabels;

        for (
            var year = this.startYear;
            year <= this.endYear;
            year += yearStep
        ) {

            drawXAxisTickLabel(
                Math.round(year),
                this.layout,
                this.mapYearToWidth.bind(this)
            );
        }


        // Draw the line chart.
        var previous = null;

        stroke(0);
        strokeWeight(2);
        noFill();

        for (
            var i = 0;
            i < this.data.getRowCount();
            i++
        ) {

            var year =
                this.data.getNum(i, 'year');

            var payGap =
                this.data.getNum(i, 'pay_gap');

            var x =
                this.mapYearToWidth(year);

            var y =
                this.mapPayGapToHeight(payGap);

            // Connect this point to the previous point.
            if (previous != null) {

                line(
                    previous.x,
                    previous.y,
                    x,
                    y
                );
            }

            // Draw point.
            fill(0);
            noStroke();

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
    };


    // ---------------------------------------------------------------
    // Map year to x position.
    // ---------------------------------------------------------------

    this.mapYearToWidth = function(year) {

        return map(
            year,
            this.startYear,
            this.endYear,
            this.layout.leftMargin,
            this.layout.rightMargin
        );
    };


    // ---------------------------------------------------------------
    // Map pay gap to y position.
    // ---------------------------------------------------------------

    this.mapPayGapToHeight = function(payGap) {

        return map(
            payGap,
            this.minPayGap,
            this.maxPayGap,
            this.layout.bottomMargin,
            this.layout.topMargin
        );
    };
}
