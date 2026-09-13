function TechDiversityGender() {
  this.name = 'Tech Diversity: Gender';
  this.id = 'tech-diversity-gender';

  this.layout = {
    /* Start - own code */

    // Move the graph 10 pixels to the left.
    leftMargin: 120,

    /* End - own code */

    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,
    plotWidth: function() {
      return this.rightMargin - this.leftMargin;
    },
    grid: true,
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  this.midX =
    (this.layout.plotWidth() / 2) +
    this.layout.leftMargin;

  this.femaleColour = color(255, 0, 0);
  this.maleColour = color(0, 255, 0);

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
    textSize(16);
  };

  this.destroy = function() {};

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    this.drawCategoryLabels();

    var lineHeight =
      (height - this.layout.topMargin) /
      this.data.getRowCount();

    for (
      var i = 0;
      i < this.data.getRowCount();
      i++
    ) {
      var lineY =
        (lineHeight * i) +
        this.layout.topMargin;

      /* Start - own code */

      // Store the company name and gender percentages
      // as properties of an object.
      var company = {
        name: this.data.getString(i, 'company'),
        female: this.data.getNum(i, 'female'),
        male: this.data.getNum(i, 'male')
      };

      /* End - own code */

      fill(0);
      noStroke();
      textAlign('right', 'top');

      text(
        company.name,
        this.layout.leftMargin - this.layout.pad,
        lineY
      );

      fill(this.femaleColour);

      rect(
        this.layout.leftMargin,
        lineY,
        this.mapPercentToWidth(company.female),
        lineHeight - this.layout.pad
      );

      /* Start - own code */

      // Draw the male section of the bar immediately
      // after the female section.
      fill(this.maleColour);

      rect(
        this.layout.leftMargin +
          this.mapPercentToWidth(company.female),
        lineY,
        this.mapPercentToWidth(company.male),
        lineHeight - this.layout.pad
      );

      /* End - own code */
    }

    stroke(150);
    strokeWeight(1);

    line(
      this.midX,
      this.layout.topMargin,
      this.midX,
      this.layout.bottomMargin
    );
  };

  this.drawCategoryLabels = function() {
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(
      'Female',
      this.layout.leftMargin +
        this.layout.plotWidth() / 4,
      this.layout.topMargin - 15
    );

    text(
      '50%',
      this.midX,
      this.layout.topMargin - 15
    );

    text(
      'Male',
      this.layout.leftMargin +
        (this.layout.plotWidth() * 3) / 4,
      this.layout.topMargin - 15
    );
  };

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
