function TechDiversityRace() {

    this.name = 'Tech Diversity: Race';
    this.id = 'tech-diversity-race';

    this.loaded = false;


    // ------------------------------------------------------------
    // Load the data
    // ------------------------------------------------------------

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


    // ------------------------------------------------------------
    // Set up the visualisation
    // ------------------------------------------------------------

    this.setup = function() {

        if (!this.loaded) {
            return;
        }

        // Create the company dropdown.
        this.select = createSelect();

        // Put the dropdown in the dashboard's visualControls area.
        this.select.parent('visualControls');
        this.select.position(0, 5);


        // Get all company names from the table.
        // The first column contains the race categories,
        // so we skip it.
        var companyNames = this.data.columns.slice(1);


        // Add each company as an option.
        for (var i = 0; i < companyNames.length; i++) {
            this.select.option(companyNames[i]);
        }


        // Select the first company by default.
        this.select.selected(companyNames[0]);


        // Save the visualisation object so that the callback
        // can refer to the correct draw function.
        var self = this;

        this.select.changed(function() {
            self.draw();
        });
    };


    // ------------------------------------------------------------
    // Remove controls when another visualisation is selected
    // ------------------------------------------------------------

    this.destroy = function() {

        if (this.select) {
            this.select.remove();
        }
    };


    // ------------------------------------------------------------
    // Draw the visualisation
    // ------------------------------------------------------------

    this.draw = function() {

        if (!this.loaded) {
            return;
        }


        background(255);


        // Get the company selected by the user.
        var companyName = this.select.value();


        // Title
        fill(0);
        noStroke();

        textSize(20);

        text(
            'Technology Diversity: Race',
            70,
            30
        );


        // Selected company
        textSize(16);

        text(
            companyName,
            70,
            60
        );


        // Get the race categories.
        var categories = this.data.getColumn('race');


        // Store the values for the selected company.
        var values = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {

            values.push(
                this.data.getNum(i, companyName)
            );
        }


        // --------------------------------------------------------
        // Draw the bars
        // --------------------------------------------------------

        var barHeight = 35;
        var startY = 100;


        for (var i = 0; i < categories.length; i++) {

            var y = startY + i * (barHeight + 10);


            // Race category
            fill(0);
            noStroke();

            textSize(12);

            text(
                categories[i],
                70,
                y + 22
            );


            // Calculate bar width.
            var barWidth = map(
                values[i],
                0,
                100,
                0,
                width - 300
            );


            // Draw bar.
            fill(100, 150, 220);

            rect(
                220,
                y,
                barWidth,
                barHeight
            );


            // Display percentage.
            fill(0);

            text(
                nf(values[i], 1, 1) + '%',
                230 + barWidth,
                y + 22
            );
        }
    };
}
