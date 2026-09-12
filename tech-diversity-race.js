function TechDiversityRace() {
    this.name = 'Tech Diversity: Race';
    this.id = 'tech-diversity-race';

    this.loaded = false;

    this.preload = function() {
        var self = this;

        this.data = loadTable(
            'data/tech-diversity-race.csv',
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

        // Create a dropdown menu for selecting a company.
        this.select = createSelect();
        this.select.position(375, 50);

        // Get the company names from the table columns.
        var companyNames = this.data.columns.slice(1);

        // Add each company as an option in the dropdown.
        for (var i = 0; i < companyNames.length; i++) {
            this.select.option(companyNames[i]);
        }

        // Select the first company by default.
        this.select.selected(companyNames[0]);

        // Redraw the visualisation when the selection changes.
        this.select.changed(function() {
            this.draw();
        });
    };

    this.destroy = function() {
        if (this.select) {
            this.select.remove();
        }
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        // Get the company selected in the dropdown.
        var companyName = this.select.value();

        fill(0);
        noStroke();
        textSize(20);

        text(
            'Technology Diversity: Race',
            70,
            30
        );

        textSize(16);

        text(
            companyName,
            70,
            60
        );

        /*
         * Each row represents a racial/ethnic category.
         * The selected company is stored in the corresponding
         * column of the table.
         */
        var categories = this.data.getColumn('race');

        var values = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {
            values.push(
                this.data.getNum(i, companyName)
            );
        }

        // Draw the bars.
        var barHeight = 35;
        var startY = 100;

        for (var i = 0; i < categories.length; i++) {

            var y = startY + i * (barHeight + 10);

            fill(0);
            noStroke();
            textSize(12);

            text(
                categories[i],
                70,
                y + 22
            );

            fill(100, 150, 220);

            var barWidth = map(
                values[i],
                0,
                100,
                0,
                width - 300
            );

            rect(
                220,
                y,
                barWidth,
                barHeight
            );

            fill(0);
            text(
                values[i] + '%',
                230 + barWidth,
                y + 22
            );
        }
    };
}
