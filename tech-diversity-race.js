function TechDiversityRace() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Tech Diversity: Race';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'tech-diversity-race';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;

        this.data = loadTable(
            './data/tech-diversity/race-2018.csv',
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

        /* Start - own code */

        // Create a dropdown so the user can select a company.
        this.select = createSelect();

        // Add the company selector to the visualisation controls area.
        this.select.parent('visualControls');
        this.select.position(0, 5);

        // Get the company names from the CSV header.
        // The first column contains the race categories.
        var companyNames = this.data.columns.slice(1);

        // Add each company to the dropdown.
        for (var i = 0; i < companyNames.length; i++) {
            this.select.option(companyNames[i]);
        }

        // Select the first company by default.
        this.select.selected(companyNames[0]);

        // Create a second dropdown to choose the graph type.
        this.graphType = createSelect();

        this.graphType.parent('visualControls');
        this.graphType.position(180, 5);

        this.graphType.option('Bar chart', 'bar');
        this.graphType.option('Pie chart', 'pie');

        // Use the bar chart as the default.
        this.graphType.selected('bar');

        /* End - own code */
    };

    this.destroy = function() {

        /* Start - own code */

        // Remove both dropdowns when another visualisation is selected.
        if (this.select) {
            this.select.remove();
        }

        if (this.graphType) {
            this.graphType.remove();
        }

        /* End - own code */
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        /* Start - own code */

        // Get the company selected by the user.
        var companyName = this.select.value();

        // Get the selected graph type.
        var graphType = this.graphType.value();

        // Get the race categories from the first column.
        var categories = this.data.getColumn(0);

        // Store the values for the selected company.
        var values = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {
            values.push(
                this.data.getNum(i, companyName)
            );
        }

        // Display the company name and visualisation title.
        fill(0);
        noStroke();
        textSize(20);
        textAlign(LEFT, TOP);

        text(
            'Technology Diversity: Race',
            70,
            25
        );

        textSize(16);

        text(
            companyName,
            70,
            55
        );

        /* End - own code */


        /* Start - own code */

        // Draw the selected graph type.
        if (graphType == 'pie') {

            // Create a set of colours for the pie chart.
            var colours = [];

            for (var i = 0; i < categories.length; i++) {
                colours.push(
                    color(
                        map(i, 0, categories.length, 50, 230),
                        map(i, 0, categories.length, 100, 200),
                        200
                    )
                );
            }

            // Create and draw the pie chart using the selected
            // company's race data.
            var pie = new PieChart(
                width / 2,
                height / 2 + 30,
                300
            );

            pie.draw(
                values,
                categories,
                colours,
                companyName + ' - Race'
            );

        } else {

            // Draw the original bar chart.
            var barHeight = 35;
            var startY = 100;

            for (var i = 0; i < categories.length; i++) {

                var y = startY + i * (barHeight + 10);

                // Draw the race category label.
                fill(0);
                noStroke();
                textSize(12);
                textAlign(LEFT, CENTER);

                text(
                    categories[i],
                    70,
                    y + barHeight / 2
                );

                // Convert the percentage into a bar width.
                var barWidth = map(
                    values[i],
                    0,
                    100,
                    0,
                    width - 300
                );

                // Draw the bar.
                fill(100, 150, 220);

                rect(
                    220,
                    y,
                    barWidth,
                    barHeight
                );

                // Display the percentage value.
                fill(0);
                textAlign(LEFT, CENTER);

                text(
                    nf(values[i], 1, 1) + '%',
                    230 + barWidth,
                    y + barHeight / 2
                );
            }
        }

        /* End - own code */
    };
}
