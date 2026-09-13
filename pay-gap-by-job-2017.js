function PayGapByJob2017() {

    this.name = "Pay Gap by Job - 2017";
    this.id = "pay-gap-by-job-2017";

    this.loaded = false;


    // ---------------------------------------------------------------
    // Load the data
    // ---------------------------------------------------------------

    this.preload = function() {

        var self = this;

        this.data = loadTable(
            './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv',
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

        // Create the job filter dropdown.
        this.jobFilter = createSelect();

        // Put the dropdown into the dashboard controls area.
        this.jobFilter.parent('visualControls');

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

        // Select all jobs by default.
        this.jobFilter.selected('all');

        var self = this;

        // Redraw when the filter changes.
        this.jobFilter.changed(function() {
            self.draw();
        });
    };


    // ---------------------------------------------------------------
    // Destroy
    // ---------------------------------------------------------------

    this.destroy = function() {

        if (this.jobFilter) {
            this.jobFilter.remove();
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
        // Title
        // -----------------------------------------------------------

        fill(0);
        noStroke();

        textSize(20);
        textAlign(LEFT, TOP);

        text(
            'Pay Gap by Job - 2017',
            70,
            25
        );


        // -----------------------------------------------------------
        // Get data
        // -----------------------------------------------------------

        var propFemale =
            this.data.getColumn('proportion_female');

        var payGap =
            this.data.getColumn('pay_gap');

        var numJobs =
            this.data.getColumn('num_jobs');


        // Convert values to numbers.
        propFemale =
            stringsToNumbers(propFemale);

        payGap =
            stringsToNumbers(payGap);

        numJobs =
            stringsToNumbers(numJobs);


        // Find minimum and maximum number of jobs.
        var numJobsMin =
            min(numJobs);

        var numJobsMax =
            max(numJobs);


        // Get selected filter.
        var filter = 'all';

        if (this.jobFilter) {
            filter = this.jobFilter.value();
        }


        // -----------------------------------------------------------
        // Draw data points
        // -----------------------------------------------------------

        for (
            var i = 0;
            i < propFemale.length;
            i++
        ) {

            // Female-dominated jobs.
            if (
                filter == 'female' &&
                propFemale[i] < 50
            ) {
                continue;
            }


            // Male-dominated jobs.
            if (
                filter == 'male' &&
                propFemale[i] >= 50
            ) {
                continue;
            }


            // X position:
            // percentage of employees who are female.
            var x = map(
                propFemale[i],
                0,
                100,
                70,
                width - 40
            );


            // Y position:
            // pay gap.
            var y = map(
                payGap[i],
                -20,
                20,
                height - 70,
                70
            );


            // Size:
            // number of jobs.
            var size = map(
                numJobs[i],
                numJobsMin,
                numJobsMax,
                5,
                25
            );


            // Draw point.
            fill(100);
            noStroke();

            ellipse(
                x,
                y,
                size,
                size
            );
        }


        // -----------------------------------------------------------
        // Axes
        // -----------------------------------------------------------

        stroke(0);
        strokeWeight(1);

        // X-axis.
        line(
            70,
            height - 70,
            width - 40,
            height - 70
        );

        // Y-axis.
        line(
            70,
            70,
            70,
            height - 70
        );


        // -----------------------------------------------------------
        // Axis labels
        // -----------------------------------------------------------

        fill(0);
        noStroke();

        textSize(12);
        textAlign(CENTER, CENTER);

        // X-axis label.
        text(
            'Female employees (%)',
            width / 2,
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


        // -----------------------------------------------------------
        // X-axis tick labels
        // -----------------------------------------------------------

        textAlign(CENTER, CENTER);

        text(
            '0%',
            70,
            height - 50
        );

        text(
            '20%',
            map(20, 0, 100, 70, width - 40),
            height - 50
        );

        text(
            '40%',
            map(40, 0, 100, 70, width - 40),
            height - 50
        );

        text(
            '60%',
            map(60, 0, 100, 70, width - 40),
            height - 50
        );

        text(
            '80%',
            map(80, 0, 100, 70, width - 40),
            height - 50
        );

        text(
            '100%',
            width - 40,
            height - 50
        );


        // -----------------------------------------------------------
        // Y-axis tick labels
        // -----------------------------------------------------------

        textAlign(RIGHT, CENTER);

        text(
            '+20%',
            60,
            70
        );

        text(
            '+10%',
            60,
            map(10, -20, 20, height - 70, 70)
        );

        text(
            '0%',
            60,
            map(0, -20, 20, height - 70, 70)
        );

        text(
            '-10%',
            60,
            map(-10, -20, 20, height - 70, 70)
        );

        text(
            '-20%',
            60,
            height - 70
        );
    };
}
