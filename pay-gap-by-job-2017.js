function PayGapByJob2017() {
    this.name = "Pay Gap by Job - 2017";
    this.id = "pay-gap-by-job-2017";

    this.loaded = false;

    this.preload = function() {
        var self = this;

        this.data = loadTable(
            "data/pay-gap-by-job-2017.csv",
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

        /*
         * FILTERING EXTENSION
         *
         * Allows the user to choose which jobs
         * should be displayed.
         */
        this.jobFilter = createSelect();

        this.jobFilter.position(300, 20);

        this.jobFilter.option("All jobs", "all");
        this.jobFilter.option(
            "Female-dominated jobs",
            "female"
        );
        this.jobFilter.option(
            "Male-dominated jobs",
            "male"
        );
    };

    this.destroy = function() {
        if (this.jobFilter) {
            this.jobFilter.remove();
        }
    };

    this.draw = function() {
        if (!this.loaded) {
            return;
        }

        background(255);

        // Title
        fill(0);
        noStroke();
        textSize(20);

        text(
            "Pay Gap by Job - 2017",
            70,
            30
        );

        /*
         * Get data from the p5.Table.
         */
        var propFemale = this.data.getColumn(
            "proportion_female"
        );

        var payGap = this.data.getColumn(
            "pay_gap"
        );

        var numJobs = this.data.getColumn(
            "num_jobs"
        );

        // Convert strings to numbers.
        propFemale = stringsToNumbers(propFemale);
        payGap = stringsToNumbers(payGap);
        numJobs = stringsToNumbers(numJobs);

        /*
         * Find the range of number of jobs.
         * This determines the size of each point.
         */
        var numJobsMin = min(numJobs);
        var numJobsMax = max(numJobs);

        var dotSizeMin = 5;
        var dotSizeMax = 25;

        /*
         * Determine which filter the user selected.
         */
        var filter = "all";

        if (this.jobFilter) {
            filter = this.jobFilter.value();
        }

        /*
         * Draw each job.
         */
        for (var i = 0; i < propFemale.length; i++) {

            /*
             * FILTERING
             *
             * Skip jobs that do not meet the
             * selected filter.
             */
            if (
                filter == "female" &&
                propFemale[i] < 50
            ) {
                continue;
            }

            if (
                filter == "male" &&
                propFemale[i] >= 50
            ) {
                continue;
            }

            /*
             * Map female representation to x.
             */
            var x = map(
                propFemale[i],
                0,
                100,
                70,
                width - 40
            );

            /*
             * Map pay gap to y.
             *
             * A larger pay gap appears higher
             * on the graph.
             */
            var y = map(
                payGap[i],
                -20,
                20,
                height - 70,
                70
            );

            /*
             * Map number of jobs to point size.
             */
            var size = map(
                numJobs[i],
                numJobsMin,
                numJobsMax,
                dotSizeMin,
                dotSizeMax
            );

            /*
             * Draw the job.
             */
            fill(100);
            noStroke();

            ellipse(
                x,
                y,
                size,
                size
            );
        }

        /*
         * Draw axes.
         */
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
            70,
            70,
            height - 70
        );

        /*
         * Axis labels.
         */
        fill(0);
        noStroke();
        textSize(12);

        text(
            "Female employees (%)",
            width / 2 - 60,
            height - 30
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

        /*
         * Add useful reference labels.
         */
        text(
            "0%",
            65,
            height - 55
        );

        text(
            "100%",
            width - 65,
            height - 55
        );

        text(
            "+20%",
            35,
            75
        );

        text(
            "0%",
            45,
            height / 2
        );

        text(
            "-20%",
            35,
            height - 75
        );
    };
}
