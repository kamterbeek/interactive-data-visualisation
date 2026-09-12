function PayGapTimeSeries() {
    this.name = "Pay Gap 1997-2017";
    this.id = "pay-gap-timeseries";

    this.loaded = false;

    this.preload = function() {
        var self = this;

        this.data = loadTable(
            './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv',
            "csv",
            "header",
            function(table) {
                self.loaded = true;
            }
        );
    };

    this.setup = function() {
        if (!this.loaded) {
            return;
        }

        this.layout = {
            leftMargin: 70,
            rightMargin: 40,
            topMargin: 60,
            bottomMargin: 70,
            pad: 20,

            plotWidth: function() {
                return width -
                    this.leftMargin -
                    this.rightMargin;
            },

            plotHeight: function() {
                return height -
                    this.topMargin -
                    this.bottomMargin;
            }
        };
    };

    this.destroy = function() {
        // No additional DOM elements to remove.
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        // Get the minimum and maximum pay gap values.
        var payGaps = this.data.getColumn("pay_gap");
        payGaps = stringsToNumbers(payGaps);

        var minPayGap = min(payGaps);
        var maxPayGap = max(payGaps);

        // Draw title.
        fill(0);
        noStroke();
        textSize(20);

        text(
            "Pay Gap 1997-2017",
            this.layout.leftMargin,
            30
        );

        // Draw axes.
        drawAxis(
            this.layout.leftMargin,
            height - this.layout.bottomMargin,
            width - this.layout.rightMargin,
            height - this.layout.bottomMargin
        );

        drawAxis(
            this.layout.leftMargin,
            height - this.layout.bottomMargin,
            this.layout.leftMargin,
            this.layout.topMargin
        );

        // Draw the data line.
        var previous = null;

        for (var i = 0; i < this.data.getRowCount(); i++) {

            var current = {
                year: this.data.getNum(i, "year"),
                payGap: this.data.getNum(i, "pay_gap")
            };

            current.x = this.mapYearToWidth(current.year);
            current.y = this.mapPayGapToHeight(
                current.payGap,
                minPayGap,
                maxPayGap
            );

            if (previous != null) {

                stroke(0);
                strokeWeight(2);

                line(
                    previous.x,
                    previous.y,
                    current.x,
                    current.y
                );
            }

            // Draw a point for each year.
            fill(0);
            noStroke();

            ellipse(
                current.x,
                current.y,
                6,
                6
            );

            previous = current;
        }

        // Axis labels.
        fill(0);
        noStroke();
        textSize(12);

        text(
            "Year",
            width / 2,
            height - 25
        );

        push();

        translate(25, height / 2);
        rotate(-HALF_PI);

        text(
            "Pay Gap (%)",
            0,
            0
        );

        pop();
    };


    /*
     * Convert a year into an x-coordinate.
     */
    this.mapYearToWidth = function(year) {

        var minYear = this.data.getNum(0, "year");

        var maxYear = this.data.getNum(
            this.data.getRowCount() - 1,
            "year"
        );

        return map(
            year,
            minYear,
            maxYear,
            this.layout.leftMargin,
            width - this.layout.rightMargin
        );
    };


    /*  Convert the pay gap into a y-coordinate. A larger pay gap should appear higher on the graph. */
    this.mapPayGapToHeight = function(
        payGap,
        minPayGap,
        maxPayGap
    ) {

        return map(
            payGap,
            minPayGap,
            maxPayGap,
            height - this.layout.bottomMargin,
            this.layout.topMargin
        );
    };
}
