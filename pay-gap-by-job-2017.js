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

  /* Start - own code */

  // Store the currently selected bubble.
  this.selectedJob = null;

  /* End - own code */


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

    // Clear the selected bubble.
    this.selectedJob = null;

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

    textSize(12);

    text(
      'Click a bubble to see job details',
      this.pad,
      48
    );

    /* End - own code */


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

    // Draw Y-axis tick labels.
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

    // Find the smallest and largest number of jobs.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    // Draw each job as a bubble.
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

      // Convert the data values into graph positions.
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

      // Scale the number of jobs into a bubble size.
      var size =
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        );

      // Check whether this bubble is selected.
      var isSelected =
        this.selectedJob != null &&
        this.selectedJob.index == i;

      if (isSelected) {
        fill(255, 180, 0);
        stroke(0);
        strokeWeight(3);
      } else {
        fill(100, 150, 220, 180);
        stroke(0);
        strokeWeight(1);
      }

      // Draw the bubble.
      ellipse(
        x,
        y,
        size,
        size
      );

      /* Start - own code */

      // Display information only for the selected bubble.
      if (isSelected) {

        var boxWidth = 280;
        var boxHeight = 115;

        var boxX = x + 15;
        var boxY = y - 50;

        // Keep the information box inside the canvas.
        if (boxX + boxWidth > width - 10) {
          boxX = x - boxWidth - 15;
        }

        if (boxY < 10) {
          boxY = 10;
        }

        if (boxY + boxHeight > height - 10) {
          boxY = height - boxHeight - 10;
        }

        // Draw the information box.
        fill(255);
        stroke(0);
        strokeWeight(1);

        rect(
          boxX,
          boxY,
          boxWidth,
          boxHeight
        );

        // Display the selected job's information.
        fill(0);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(12);

        text(
          'Job: ' + jobs[i],
          boxX + 10,
          boxY + 10,
          boxWidth - 20
        );

        text(
          'Female employees: ' +
          nf(propFemale[i], 1, 1) + '%',
          boxX + 10,
          boxY + 40
        );

        text(
          'Pay gap: ' +
          nf(payGap[i], 1, 1) + '%',
          boxX + 10,
          boxY + 60
        );

        text(
          'Number of jobs: ' +
          nf(numJobs[i], 1, 0),
          boxX + 10,
          boxY + 80
        );
      }

      /* End - own code */
    }

    /* End - own code */
  };


  /* Start - own code */

  // Handle clicks on the p5 canvas.
  this.mousePressed = function() {

    if (!this.loaded) {
      return;
    }

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

    var filter = 'all';

    if (this.jobFilter) {
      filter = this.jobFilter.value();
    }

    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    // Check each bubble for a click.
    for (
      var i = 0;
      i < jobs.length;
      i++
    ) {

      // Respect the current filter.
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

      var size =
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        );

      // Calculate the distance from the mouse
      // to the centre of the bubble.
      var distance =
        dist(
          mouseX,
          mouseY,
          x,
          y
        );

      /* Start - own code */

      // Add an invisible 8-pixel click area around
      // each bubble to make small bubbles easier to select.
      if (distance <= size / 2 + 8) {

        this.selectedJob = {
          index: i
        };

        return;
      }

      /* End - own code */
    }

    // Clicking elsewhere clears the selection.
    this.selectedJob = null;
  };

  /* End - own code */
}
