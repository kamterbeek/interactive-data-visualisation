function TechDiversityRace() {

    this.name = 'Tech Diversity: Race';
    this.id = 'tech-diversity-race';

    this.loaded = false;


    // ---------------------------------------------------------------
    // Load the data
    // ---------------------------------------------------------------

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


    // ---------------------------------------------------------------
    // Setup
    // ---------------------------------------------------------------

    this.setup = function() {

        if (!this.loaded) {
            return;
        }

        // Create the company dropdown.
        this.select = createSelect();

        // Put the dropdown into the dashboard controls area.
        this.select.parent('visualControls');

        this.select.position(0, 5);


        // The first column contains the race categories.
        // All remaining columns contain company names.
        var companyNames =
            this.data.columns.slice(1);


        // Add each company as an option.
        for (
            var i = 0;
            i < companyNames.length;
            i++
        ) {

            this.select.option(
                companyNames[i]
            );
        }


        // Select the first company by default.
        this.select.selected(
            companyNames[0]
        );
    };


    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    this.destroy = function() {

        if (this.select) {
            this.select.remove();
        }
    };


    // ---------------------------------------------------------------
    // Draw
    // ---------------------------------------------------------------

    this.draw = function() {

        if (!this.loaded) {
            return;
        }

        background(255);


        // -----------------------------------------------------------
        // Selected company
        // -----------------------------------------------------------

        var companyName =
            this.select.value();


        // -----------------------------------------------------------
        // Race categories
        // -----------------------------------------------------------

        // IMPORTANT:
        // The first column of the CSV contains the race labels.
        // It does not have a column name, so we access it by index.
        var categories =
            this.data.getColumn(0);


        // -----------------------------------------------------------
        // Company values
        // -----------------------------------------------------------

        var values = [];

        for (
            var i = 0;
            i < this.data.getRowCount();
            i++
        ) {

            values.push(
                this.data.getNum(
                    i,
                    companyName
                )
            );
        }


        // -----------------------------------------------------------
        // Title
        // -----------------------------------------------------------

        fill(0);
        noStroke();

        textSize(20);
        textAlign(LEFT, TOP);

        text(
            'Technology Diversity: Race',
            70,
            25
        );


        // Selected company.
        textSize(16);

        text(
            companyName,
            70,
            55
        );


        // -----------------------------------------------------------
        // Draw bars
        // -----------------------------------------------------------

        var barHeight = 35;
        var startY = 100;


        for (
            var i = 0;
            i < categories.length;
            i++
        ) {

            var y =
                startY +
                i * (barHeight + 10);


            // Race category label.
            fill(0);
            noStroke();

            textSize(12);
            textAlign(LEFT, CENTER);

            text(
                categories[i],
                70,
                y + barHeight / 2
            );


            // Calculate bar width.
            var barWidth =
                map(
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


            // Percentage.
            fill(0);

            textAlign(LEFT, CENTER);

            text(
                nf(values[i], 1, 1) + '%',
                230 + barWidth,
                y + barHeight / 2
            );
        }
    };
}
