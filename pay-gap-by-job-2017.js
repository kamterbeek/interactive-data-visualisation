function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 60;
  this.dotSizeMin = 8;
  this.dotSizeMax = 28;

  // Preload...
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


  this.setup = function() {

    if (!this.loaded) {
      return;
    }

    /* Start - own code */

    // Create a filter so users can choose which jobs to display.
    this.jobFilter = createSelect();
    this.jobFilter.parent('visualControls');
    this.jobFilter.position(0, 5);

    this.jobFilter.option('All jobs', 'all');
    this.jobFilter.option(
      'Female-dominated jobs',
      'female'
    );
    this.jobFilter.option(
      'Male-dominated jobs',
      'male'
    );

    this.jobFilter.selected('all');

    /* End - own code */
  };


  this.destroy = function() {

    /* Start - own code */

    // Remove the filter when another visualisation is selected.
    if (this.jobFilter) {
      this.jobFilter.remove();
    }

    /* End - own code */
  };


  this.draw = function() {

    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    background(255);


    /* Start - own code */

    // Get the data needed for the scatter plot.
    var jobs =
      this.data.getColumn('job_subtype');

    var propFemale =
      stringsToNumbers(
        this.data.getColumn('proportion_female')
      );

    var payGap =
      stringsToNumbers(
        this.data.getColumn('pay_gap')
      );

    var numJobs =
      stringsToNumbers(
        this.data.getColumn('num_jobs')
      );

    // Get the selected filter.
    var filter = 'all';

    if (this.jobFilter) {
      filter = this.jobFilter.value();
    }

    /* End - own code */


    /* Start - own code */

    // Draw the title.
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(20);

    text(
      'Pay Gap by Job - 2017',
      this.pad,
      20
    );

    // Explain what the visualisation shows.
    textSize(12);

    text(
      'Bubble size represents the number of jobs',
      this.pad,
      48
    );

    /* End - own code */


    /* Start - own code */

    // Draw the horizontal and vertical axes.
    stroke(0);
    strokeWeight(1);

    line(
      this.pad,
      height - this.pad,
      width - this.pad,
      height - this.pad
    );

    line(
      this.pad,
      this.pad + 20,
      this.pad,
      height - this.pad
    );

    /* End - own code */


    /* Start - own code */

    // Draw the X-axis label.
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);

    text(
      'Female employees (%)',
      width / 2,
      height - 20
    );

    // Draw the Y-axis label.
    push();

    translate(
      18,
      height / 2
    );

    rotate(-HALF_PI);

    text(
      'Pay gap (%)',
      0,
      0
    );

    pop();

    /* End - own code */


    /* Start - own code */

    // Draw X-axis tick labels.
    textSize(11);
    textAlign(CENTER, TOP);

    for (
      var xValue = 0;
      xValue <= 100;
      xValue += 20
    ) {

      var x =
        map(
          xValue,
          0,
          100,
          this.pad,
          width - this.pad
        );

      stroke(220);

      line(
        x,
        this.pad + 20,
        x,
        height - this.pad
      );

      fill(0);
      noStroke();

      text(
        xValue + '%',
        x,
        height - this.pad + 8
      );
    }

    /* End - own code */


    /* Start - own code */

    // Draw Y-axis tick labels from -20% to +20%.
    textAlign(RIGHT, CENTER);

    for (
      var yValue = -20;
      yValue <= 20;
      yValue += 5
    ) {

      var y =
        map(
          yValue,
          -20,
          20,
          height - this.pad,
          this.pad + 20
        );

      stroke(220);

      line(
        this.pad,
        y,
        width - this.pad,
        y
      );

      fill(0);
      noStroke();

      var label = yValue + '%';

      if (yValue > 0) {
        label = '+' + yValue + '%';
      }

      text(
        label,
        this.pad - 8,
        y
      );
    }

    /* End - own code */


    /* Start - own code */

    // Find the smallest and largest job counts.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    // Draw one bubble for each job.
    for (
      var i = 0;
      i < jobs.length;
      i++
    ) {

      // Apply the selected job filter.
      if (
        filter == 'female' &&
        propFemale[i] < 50
      ) {
        continue;
      }

      if (
        filter == 'male' &&
        propFemale[i] >= 50
      ) {
        continue;
      }

      // Convert the data values into screen positions.
      var x =
        map(
          propFemale[i],
          0,
          100,
          this.pad,
          width - this.pad
        );

      var y =
        map(
          payGap[i],
          -20,
          20,
          height - this.pad,
          this.pad + 20
        );

      // Scale the number of jobs into a sensible
      // bubble size.
      var size =
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        );

      // Draw the bubble.
      fill(100, 150, 220, 180);
      stroke(0);
      strokeWeight(1);

      ellipse(
        x,
        y,
        size,
        size
      );

      // Add the job name beside the bubble.
      fill(0);
      noStroke();
      textAlign(LEFT, CENTER);
      textSize(9);

      text(
        jobs[i],
        x + size / 2 + 4,
        y
      );
    }

    /* End - own code */
  };
}
