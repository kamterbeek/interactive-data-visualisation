function ClimateChange() {

    // Name for the visualisation.
    this.name = 'Climate Change';

    // Unique ID.
    this.id = 'climate-change';

    // Axis labels.
    this.xAxisLabel = 'year';
    this.yAxisLabel = '℃';


    // ---------------------------------------------------------------
    // Layout
    // ---------------------------------------------------------------

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

        // Show grid lines.
        grid: false,

        // Number of axis tick labels.
        numXTickLabels: 8,
        numYTickLabels: 8
    };


    // ---------------------------------------------------------------
    // Data
    // ---------------------------------------------------------------

    this.loaded = false;


    // Load the climate data.
    this.preload = function() {

        var self = this;

        this.data = loadTable(
            './data/surface-temperature/surface-temperature.csv',
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
        textAlign('center', 'center');


        // Find the first and last year.
        this.minYear =
            this.data.getNum(0, 'year');

        this.maxYear =
            this.data.getNum(
                this.data.getRowCount() - 1,
                'year'
            );


        // Find minimum and maximum temperatures.
        var temperatures =
            this.data.getColumn('temperature');

        temperatures =
            stringsToNumbers(temperatures);

        this.minTemperature =
            min(temperatures);

        this.maxTemperature =
            max(temperatures);


        // Calculate summary statistics.
        var stats =
            calculateStats(temperatures);

        this.meanTemperature = stats.mean;
        this.minTemperature = stats.min;
        this.maxTemperature = stats.max;


        // -----------------------------------------------------------
        // Animation
        // -----------------------------------------------------------

        this.frameCount = 0;


        // -----------------------------------------------------------
        // Start-year slider
        // -----------------------------------------------------------

        this.startSlider = createSlider(
            this.minYear,
            this.maxYear - 1,
            this.minYear,
            1
        );

        // Put the slider into the dashboard controls area.
        this.startSlider.parent('visualControls');

        this.startSlider.position(0, 5);


        // -----------------------------------------------------------
        // End-year slider
        // -----------------------------------------------------------

        this.endSlider = createSlider(
            this.minYear + 1,
            this.maxYear,
            this.maxYear,
            1
        );

        // Put the slider into the dashboard controls area.
        this.endSlider.parent('visualControls');

        this.endSlider.position(220, 5);
    };


    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    this.destroy = function() {

        if (this.startSlider) {
            this.startSlider.remove();
        }

        if (this.endSlider) {
            this.endSlider.remove();
        }
    };


    // ---------------------------------------------------------------
    // Draw
    // ---------------------------------------------------------------

    this.draw = function() {

        if (!this.loaded) {
            return;
        }


        // Prevent the sliders from overlapping.
        if (
            this.startSlider.value() >=
            this.endSlider.value()
        ) {

            this.startSlider.value(
                this.endSlider.value() - 1
            );
        }


        // Get selected years.
        this.startYear =
            this.startSlider.value();

        this.endYear =
            this.endSlider.value();


        // -----------------------------------------------------------
        // Title
        // -----------------------------------------------------------

        fill(0);
        noStroke();

        textSize(20);
        textAlign(LEFT, TOP);

        text(
            'Climate Change',
            this.layout.leftMargin,
            10
        );


        // -----------------------------------------------------------
        // Summary statistics
        // -----------------------------------------------------------

        textSize(14);
        textAlign(LEFT, CENTER);

        text(
            'Minimum: ' +
            nf(this.minTemperature, 1, 2) +
            '℃',
            700,
            25
        );

        text(
            'Maximum: ' +
            nf(this.maxTemperature, 1, 2) +
            '℃',
            700,
            45
        );

        text(
            'Average: ' +
            nf(this.meanTemperature, 1, 2) +
            '℃',
            700,
            65
        );


        // -----------------------------------------------------------
        // Y-axis labels
        // -----------------------------------------------------------

        drawYAxisTickLabels(
            this.minTemperature,
            this.maxTemperature,
            this.layout,
            this.mapTemperatureToHeight.bind(this),
            1
        );


        // -----------------------------------------------------------
        // Axes
        // -----------------------------------------------------------

        drawAxis(this.layout);


        // -----------------------------------------------------------
        // Axis labels
        // -----------------------------------------------------------

        drawAxisLabels(
            this.xAxisLabel,
            this.yAxisLabel,
            this.layout
        );


        // -----------------------------------------------------------
        // Average temperature line
        // -----------------------------------------------------------

        stroke(200);
        strokeWeight(1);

        line(
            this.layout.leftMargin,
            this.mapTemperatureToHeight(
                this.meanTemperature
            ),
            this.layout.rightMargin,
            this.mapTemperatureToHeight(
                this.meanTemperature
            )
        );


        // -----------------------------------------------------------
        // Plot temperature data
        // -----------------------------------------------------------

        var previous;

        var numYears =
            this.endYear - this.startYear;

        var segmentWidth =
            this.layout.plotWidth() / numYears;

        var yearCount = 0;


        // Loop through all rows.
        for (
            var i = 0;
            i < this.data.getRowCount();
            i++
        ) {

            // Store the current year's data.
            var current = {

                year:
                    this.data.getNum(
                        i,
                        'year'
                    ),

                temperature:
                    this.data.getNum(
                        i,
                        'temperature'
                    )
            };


            // Only draw data inside the selected range.
            if (
                previous != null &&
                current.year > this.startYear &&
                current.year <= this.endYear
            ) {


                // ---------------------------------------------------
                // Temperature gradient
                // ---------------------------------------------------

                noStroke();

                fill(
                    this.mapTemperatureToColour(
                        current.temperature
                    )
                );

                rect(
                    this.mapYearToWidth(previous.year),
                    this.layout.topMargin,
                    this.mapYearToWidth(current.year) -
                    this.mapYearToWidth(previous.year),
                    this.layout.plotHeight()
                );


                // ---------------------------------------------------
                // Line between years
                // ---------------------------------------------------

                stroke(0);
                strokeWeight(1);

                line(
                    this.mapYearToWidth(previous.year),
                    this.mapTemperatureToHeight(
                        previous.temperature
                    ),

                    this.mapYearToWidth(current.year),
                    this.mapTemperatureToHeight(
                        current.temperature
                    )
                );


                // ---------------------------------------------------
                // X-axis labels
                // ---------------------------------------------------

                var xLabelSkip =
                    ceil(
                        numYears /
                        this.layout.numXTickLabels
                    );


                if (
                    yearCount % xLabelSkip == 0
                ) {

                    drawXAxisTickLabel(
                        previous.year,
                        this.layout,
                        this.mapYearToWidth.bind(this)
                    );
                }


                // If only a few years are displayed,
                // also draw the final year.
                if (
                    numYears <= 6 &&
                    yearCount == numYears - 1
                ) {

                    drawXAxisTickLabel(
                        current.year,
                        this.layout,
                        this.mapYearToWidth.bind(this)
                    );
                }


                yearCount++;
            }


            // Stop drawing when the animation reaches
            // the current frame.
            if (
                yearCount >= this.frameCount
            ) {
                break;
            }


            // Store the current year for the
            // next line segment.
            previous = current;
        }


        // Advance animation.
        this.frameCount++;


        // Stop once all years have been drawn.
        if (
            this.frameCount >= numYears
        ) {

            // Keep draw loop running so that
            // changing the sliders updates the graph.
            // noLoop();
        }
    };


    // ---------------------------------------------------------------
    // Map year to canvas width
    // ---------------------------------------------------------------

    this.mapYearToWidth = function(value) {

        return map(
            value,

            this.startYear,
            this.endYear,

            this.layout.leftMargin,
            this.layout.rightMargin
        );
    };


    // ---------------------------------------------------------------
    // Map temperature to canvas height
    // ---------------------------------------------------------------

    this.mapTemperatureToHeight = function(value) {

        return map(
            value,

            this.minTemperature,
            this.maxTemperature,

            this.layout.bottomMargin,
            this.layout.topMargin
        );
    };


    this.mapTemperatureToColour = function(value) {

        var red =
            map(
                value,

                this.minTemperature,
                this.maxTemperature,

                0,
                255
            );

        var blue =
            255 - red;

        return color(
            red,
            0,
            blue,
            100
        );
    };
}
