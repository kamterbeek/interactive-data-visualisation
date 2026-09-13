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

        // Add the dropdown to the visualisation controls area.
        this.select.parent('visualControls');
        this.select.position(0, 5);

        // Get the company names from the CSV header.
        // The first column contains the race categories, so it is excluded.
        var companyNames = this.data.columns.slice(1);

        // Add each company as an option in the dropdown.
        for (var i = 0; i < companyNames.length; i++) {
            this.select.option(companyNames[i]);
        }

        // Select the first company by default.
        this.select.selected(companyNames[0]);

        /* End - own code */
    };

    this.destroy = function() {
        /* Start - own code */

        // Remove the dropdown when another visualisation is selected.
        if (this.select) {
            this.select.remove();
        }

        /* End - own code */
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        /* Start - own code */

        // Get the company selected in the dropdown.
        var companyName = this.select.value();

        // Get the race categories from the first CSV column.
        var categories = this.data.getColumn(0);

        // Store the values for the selected company.
        var values = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {
            values.push(
                this.data.getNum(i, companyName)
            );
        }

        /* End - own code */

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

        var barHeight = 35;
        var startY = 100;

        /* Start - own code */

        // Draw one bar for each race category.
        for (var i = 0; i < categories.length; i++) {

            var y = startY + i * (barHeight + 10);

            // Draw the category label.
            fill(0);
            noStroke();
            textSize(12);
            textAlign(LEFT, CENTER);

            text(
                categories[i],
                70,
                y + barHeight / 2
            );

            // Convert the percentage value into a bar width.
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

        /* End - own code */
    };
}
