function PayGapByJob2017() {

    this.name = "Pay Gap by Job - 2017";
    this.id = "pay-gap-by-job-2017";

    this.loaded = false;


    // ------------------------------------------------------------
    // Load the data
    // ------------------------------------------------------------

    this.preload = function() {

        var self = this;

        this.data = loadTable(
            './data/pay-gap-by-job-2017.csv',
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


        // Create the job filter dropdown.
        this.jobFilter = createSelect();


        // Put it inside the dashboard controls area.
        this.jobFilter.parent('visualControls');

        // Position it at the beginning of the controls area.
        this.jobFilter.position(0, 5);


        // Add filter options.
        this.jobFilter.option(
            'All jobs',
            'all'
        );

        this.jobFilter.option(
            'Female-dominated jobs',
            'female'
        );

        this.jobFilter.option(
            'Male-dominated jobs',
            'male'
        );


        // Select "All jobs" by default.
        this.jobFilter.selected('all');


        // Redraw when the filter changes.
        var self = this;

        this.jobFilter.changed(function() {
            self.draw();
        });
    };


    // ------------------------------------------------------------
    // Remove the dropdown when another graph is selected
    // ------------------------------------------------------------

    this.destroy = function() {

        if (this.jobFilter) {
            this.jobFilter.remove();
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


        // --------------------------------------------------------
        // Title
        // --------------------------------------------------------

        fill(0);
        noStroke();

        textSize(20);

        text(
            'Pay Gap by Job - 2017',
            70,
            30
        );


        // --------------------------------------------------------
        // Get the data
        // --------------------------------------------------------

        var propFemale = this.data.getColumn(
            'proportion_female'
        );

        var payGap = this.data.getColumn(
            'pay_gap'
        );

        var numJobs = this.data.getColumn(
            'num_jobs'
        );


        // Convert strings into numbers.
        propFemale = stringsToNumbers(propFemale);
        payGap = stringsToNumbers(payGap);
        numJobs = stringsToNumbers(numJobs);


        // Find the minimum and maximum number of jobs.
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);


        // --------------------------------------------------------
        // Get the selected filter
        // --------------------------------------------------------

        var filter = 'all';

        if (this.jobFilter) {
            filter = this.jobFilter.value();
        }


        // --------------------------------------------------------
        // Draw the data points
        // --------------------------------------------------------

        for (var i = 0; i < propFemale.length; i++) {


            // Female-dominated filter.
            if (
                filter == 'female' &&
                propFemale[i] < 50
            ) {
                continue;
            }


            // Male-dominated filter.
            if (
                filter == 'male' &&
                propFemale[i] >= 50
            ) {
                continue;
            }


            // Map percentage of female employees
            // to the x-axis.
            var x = map(
                propFemale[i],
                0,
                100,
                70,
                width - 40
            );


            // Map pay gap to the y-axis.
            var y = map(
                payGap[i],
                -20,
                20,
                height - 70,
                70
            );


            // Map number of jobs to the size of the dot.
            var size = map(
                numJobs[i],
                numJobsMin,
                numJobsMax,
                5,
                25
            );


            // Draw the data point.
            fill(100);
            noStroke();

            ellipse(
                x,
                y,
                size,
                size
            );
        }


        // --------------------------------------------------------
        // Draw axes
        // --------------------------------------------------------

        stroke(0);
        strokeWeight(1);


        // X-axis
        line(
            70,
            height - 70,
            width - 40,
            height - 70
        );


        // Y-axis
        line(
            70,
            70,
            70,
            height - 70
        );


        // --------------------------------------------------------
        // Axis labels
        // --------------------------------------------------------

        fill(0);
        noStroke();

        textSize(12);


        // X-axis label.
        text(
            'Female employees (%)',
            width / 2 - 60,
            height - 30
        );


        // Y-axis label.
        push();

        translate(
            25,
            height / 2
        );

        rotate(-HALF_PI);

        text(
            'Pay Gap (%)',
            0,
            0
        );

        pop();


        // --------------------------------------------------------
        // X-axis values
        // --------------------------------------------------------

        text(
            '0%',
            65,
            height - 55
        );

        text(
            '100%',
            width - 65,
            height - 55
        );


        // --------------------------------------------------------
        // Y-axis values
        // --------------------------------------------------------

        text(
            '+20%',
            35,
            75
        );

        text(
            '0%',
            45,
            height / 2
        );

        text(
            '-20%',
            35,
            height - 75
        );
    };
}
