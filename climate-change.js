function ClimateChange() {
    this.name = "Climate Change";
    this.id = "climate-change";

    this.loaded = false;

    this.startYear = 1960;
    this.endYear = 2020;

    this.startSlider;
    this.endSlider;
    this.stats;

    this.preload = function() {
        var self = this;
        this.data = loadTable(
            "data/climate-change.csv",
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

        this.startYear = this.data.getNum(0, "year");
        this.endYear = this.data.getNum(
            this.data.getRowCount() - 1,
            "year"
        );

        // Start year slider
        this.startSlider = createSlider(
            this.startYear,
            this.endYear,
            this.startYear,
            1
        );

        this.startSlider.position(20, 20);

        // End year slider
        this.endSlider = createSlider(
            this.startYear,
            this.endYear,
            this.endYear,
            1
        );

        this.endSlider.position(20, 50);

        // Statistics display
        this.stats = createP("");
        this.stats.position(700, 10);
    };

    this.destroy = function() {
        if (this.startSlider) {
            this.startSlider.remove();
        }

        if (this.endSlider) {
            this.endSlider.remove();
        }

        if (this.stats) {
            this.stats.remove();
        }
    };

    /*
     * Calculate minimum, maximum and average
     * temperature for the selected year range.
     */
    this.calculateStats = function() {
        var temperatures = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {

            var year = this.data.getNum(i, "year");
            var temperature = this.data.getNum(i, "temperature");

            if (year >= this.startYear &&
                year <= this.endYear) {

                temperatures.push(temperature);
            }
        }

        if (temperatures.length === 0) {
            return {
                min: 0,
                max: 0,
                mean: 0
            };
        }

        var minimum = temperatures[0];
        var maximum = temperatures[0];
        var total = 0;

        for (var j = 0; j < temperatures.length; j++) {

            var value = temperatures[j];

            total += value;

            if (value < minimum) {
                minimum = value;
            }

            if (value > maximum) {
                maximum = value;
            }
        }

        return {
            min: minimum,
            max: maximum,
            mean: total / temperatures.length
        };
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        // Update selected year range
        this.startYear = this.startSlider.value();
        this.endYear = this.endSlider.value();

        // Make sure the sliders cannot cross
        if (this.startYear > this.endYear) {
            this.startYear = this.endYear;
            this.startSlider.value(this.startYear);
        }

        // Calculate statistics for selected range
        var stats = this.calculateStats();

        // Display statistics
        this.stats.html(
            "Temperature Statistics<br>" +
            "Minimum: " + nf(stats.min, 1, 2) + "°C<br>" +
            "Maximum: " + nf(stats.max, 1, 2) + "°C<br>" +
            "Average: " + nf(stats.mean, 1, 2) + "°C"
        );

        // Labels for sliders
        fill(0);
        noStroke();
        textSize(12);

        text(
            "Start Year: " + this.startYear,
            170,
            32
        );

        text(
            "End Year: " + this.endYear,
            170,
            62
        );

        // Find temperature range in the complete dataset
        var temperatures = this.data.getColumn("temperature");
        temperatures = stringsToNumbers(temperatures);

        var minTemperature = min(temperatures);
        var maxTemperature = max(temperatures);

        var firstYear = this.data.getNum(0, "year");
        var lastYear = this.data.getNum(
            this.data.getRowCount() - 1,
            "year"
        );

        // Draw graph
        var previous = null;

        for (var i = 0; i < this.data.getRowCount(); i++) {

            var currentYear = this.data.getNum(i, "year");
            var currentTemperature =
                this.data.getNum(i, "temperature");

            // Filtering by selected year range
            if (currentYear >= this.startYear &&
                currentYear <= this.endYear) {

                var x = map(
                    currentYear,
                    firstYear,
                    lastYear,
                    70,
                    width - 40
                );

                var y = map(
                    currentTemperature,
                    minTemperature,
                    maxTemperature,
                    height - 70,
                    100
                );

                // Temperature colour
                fill(
                    this.mapTemperatureToColour(
                        currentTemperature,
                        minTemperature,
                        maxTemperature
                    )
                );

                noStroke();

                // Draw the temperature point
                ellipse(x, y, 8, 8);

                // Draw line connecting points
                if (previous != null) {

                    stroke(100);
                    strokeWeight(1);

                    line(
                        previous.x,
                        previous.y,
                        x,
                        y
                    );
                }

                previous = {
                    x: x,
                    y: y
                };
            }
        }

        // Axes
        stroke(0);
        strokeWeight(1);

        line(
            70,
            height - 70,
            width - 40,
            height - 70
        );

        line(
            70,
            100,
            70,
            height - 70
        );

        // Axis labels
        noStroke();
        fill(0);

        textSize(12);

        text(
            "Year",
            width / 2,
            height - 30
        );

        push();

        translate(25, height / 2);
        rotate(-HALF_PI);

        text(
            "Temperature (°C)",
            0,
            0
        );

        pop();
    };

    /*
     * Convert temperature into a colour value.
     */
    this.mapTemperatureToColour = function(
        temperature,
        minTemperature,
        maxTemperature
    ) {

        var colourValue = map(
            temperature,
            minTemperature,
            maxTemperature,
            0,
            255
        );

        return color(
            colourValue,
            100,
            255 - colourValue
        );
    };
}
