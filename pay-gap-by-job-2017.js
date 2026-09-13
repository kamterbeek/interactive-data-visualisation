function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });

  };

  /* Start - own code */

  // Create a dropdown filter so users can select which jobs to display.
  this.setup = function() {
    if (!this.loaded) return;

    this.jobFilter = createSelect();
    this.jobFilter.parent('visualControls');
    this.jobFilter.position(0, 5);

    this.jobFilter.option('All jobs', 'all');
    this.jobFilter.option('Female-dominated jobs', 'female');
    this.jobFilter.option('Male-dominated jobs', 'male');

    this.jobFilter.selected('all');

    var self = this;

    this.jobFilter.changed(function() {
      self.draw();
    });
  };

  // Remove the filter when another visualisation is selected.
  this.destroy = function() {
    if (this.jobFilter) {
      this.jobFilter.remove();
    }
  };

  /* End - own code */

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    /* Start - own code */

    // Get the selected filter value.
    var filter = 'all';

    if (this.jobFilter) {
      filter = this.jobFilter.value();
    }

    /* End - own code */

    for (var i = 0; i < this.data.getRowCount(); i++) {

      /* Start - own code */

      // Apply the selected job filter.
      if (filter == 'female' && propFemale[i] < 50) {
        continue;
      }

      if (filter == 'male' && propFemale[i] >= 50) {
        continue;
      }

      // Map the percentage of female employees to the x position.
      var x = map(
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        this.pad,
        width - this.pad
      );

      // Map the pay gap to the y position.
      var y = map(
        payGap[i],
        payGapMin,
        payGapMax,
        height - this.pad,
        this.pad
      );

      // Scale the number of jobs to determine the dot size.
      var size = map(
        numJobs[i],
        numJobsMin,
        numJobsMax,
        this.dotSizeMin,
        this.dotSizeMax
      );

      // Draw the job as a circle.
      ellipse(x, y, size, size);

      /* End - own code */
    }
  };

  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
  };
}
