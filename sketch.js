// Global variable to store the gallery object.
var gallery;


function setup() {

    // Create the canvas.
    var c = createCanvas(1024, 576);
    c.parent('app');

    // Create the Gallery object.
    gallery = new Gallery();

    // Add all five visualisations to the gallery.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new PayGapTimeSeries());
    gallery.addVisual(new ClimateChange());


    // Connect the visualisation dropdown
    // in index.html to the Gallery.
    var graphSelect = document.getElementById('graphSelect');

    if (graphSelect) {

        graphSelect.addEventListener('change', function() {

            var selectedGraph = this.value;

            // Only change visualisation if the user
            // has selected an option.
            if (selectedGraph != "") {

                gallery.selectVisual(selectedGraph);
            }
        });
    }
}


function draw() {

    // Clear the canvas.
    background(255);

    // Draw the currently selected visualisation.
    if (
        gallery != null &&
        gallery.selectedVisual != null
    ) {

        gallery.selectedVisual.draw();
    }
}
