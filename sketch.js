// Global variable to store the gallery object.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  var c = createCanvas(1024, 576);
  c.parent('app');

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());

  /* Start - own code */

  // Connect the visualisation dropdown in index.html to the Gallery.
  var graphSelect = document.getElementById('graphSelect');

  if (graphSelect) {
    graphSelect.addEventListener('change', function() {
      var selectedGraph = this.value;

      if (selectedGraph != "") {
        gallery.selectVisual(selectedGraph);
      }
    });
  }

  // Connect mouse clicks directly to the p5 canvas.
  c.mousePressed(function() {

    if (
      gallery != null &&
      gallery.selectedVisual != null &&
      gallery.selectedVisual.hasOwnProperty('mousePressed')
    ) {
      gallery.selectedVisual.mousePressed();
    }
  });

  /* End - own code */
}

function draw() {
  background(255);

  if (
    gallery != null &&
    gallery.selectedVisual != null
  ) {
    gallery.selectedVisual.draw();
  }
}
