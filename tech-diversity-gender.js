function TechDiversityGender() {

    this.name = 'Tech Diversity: Gender';
    this.id = 'tech-diversity-gender';

    this.loaded = false;

    this.preload = function() {

        var self = this;

        this.data = loadTable(
            './data/tech-diversity/gender-2018.csv',
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

        this.layout = {
            leftMargin: 100,
            rightMargin: 40,
            topMargin: 70,
            bottomMargin: 70,
            pad: 20,

            plotWidth: function() {
                return width -
                    this.leftMargin -
                    this.rightMargin;
            },

            plotHeight: function() {
                return height -
                    this.topMargin -
                    this.bottomMargin;
            }
        };

        // Colours for the two sections of each bar.
        this.femaleColour = color(230, 100, 150);
        this.maleColour = color(100, 150, 220);
    };


    this.destroy = function() {
        // No additional DOM elements to remove.
    };


    this.draw = function() {

        if (!this.loaded) {
            return;
        }

        background(255);

        // Title.
        fill(0);
        noStroke();
        textSize(20);

        text(
            'Technology Diversity: Gender',
            this.layout.leftMargin,
            35
        );


        /*
         * Extract the data from the p5.Table.
         */
        var companies = [];

        for (var i = 0; i < this.data.getRowCount(); i++) {

            var company = {
                name: this.data.getString(i, 'company'),
                female: this.data.getNum(i, 'female'),
                male: this.data.getNum(i, 'male')
            };

            companies.push(company);
        }


        /*
         * Draw one stacked bar for each company.
         */
        var lineHeight =
            this.layout.plotHeight() / companies.length;


        for (var i = 0; i < companies.length; i++) {

            var company = companies[i];

            var lineY =
                this.layout.topMargin +
                i * lineHeight;


            // Company name.
            fill(0);
            noStroke();
            textSize(12);

            text(
                company.name,
                10,
                lineY + lineHeight / 2
            );


            // Female section.
            fill(this.femaleColour);

            rect(
                this.layout.leftMargin,
                lineY,
                this.mapPercentToWidth(company.female),
                lineHeight - this.layout.pad
            );


            // Male section.
            fill(this.maleColour);

            rect(
                this.layout.leftMargin +
                this.mapPercentToWidth(company.female),

                lineY,

                this.mapPercentToWidth(company.male),

                lineHeight - this.layout.pad
            );


            // Percentage labels.
            fill(0);
            noStroke();
            textSize(10);

            text(
                company.female + '%',
                this.layout.leftMargin +
                this.mapPercentToWidth(company.female) / 2 - 10,

                lineY + lineHeight / 2
            );

            text(
                company.male + '%',
                this.layout.leftMargin +
                this.mapPercentToWidth(company.female) +
                this.mapPercentToWidth(company.male) / 2 - 10,

                lineY + lineHeight / 2
            );
        }


        /*
         * X-axis.
         */
        stroke(0);
        strokeWeight(1);

        line(
            this.layout.leftMargin,
            height - this.layout.bottomMargin,
            width - this.layout.rightMargin,
            height - this.layout.bottomMargin
        );


        /*
         * X-axis labels.
         */
        fill(0);
        noStroke();
        textSize(11);

        for (var percentage = 0; percentage <= 100; percentage += 20) {

            var x = this.layout.leftMargin +
                this.mapPercentToWidth(percentage);

            text(
                percentage + '%',
                x - 10,
                height - this.layout.bottomMargin + 20
            );
        }


        // Legend.
        fill(this.femaleColour);

        rect(
            width - 220,
            height - 45,
            15,
            15
        );

        fill(0);
        text(
            'Female',
            width - 200,
            height - 32
        );


        fill(this.maleColour);

        rect(
            width - 120,
            height - 45,
            15,
            15
        );

        fill(0);
        text(
            'Male',
            width - 100,
            height - 32
        );
    };


    /*
     * Convert a percentage into a width
     * that fits inside the graph.
     */
    this.mapPercentToWidth = function(percent) {

        return map(
            percent,
            0,
            100,
            0,
            this.layout.plotWidth()
        );
    };
}
