// Global variable to store the gallery object.
var gallery;

function setup() {

    // Create a canvas to fill the content div from index.html.
    var c = createCanvas(1024, 576);
    c.parent('app');

    // Create a new gallery object.
    gallery = new Gallery();

    // Add the visualisation objects.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new PayGapTimeSeries());
    gallery.addVisual(new ClimateChange());

    /*
     * Connect the visualisation dropdown to the
     * existing Gallery object.
     */
    var graphSelect = document.getElementById('graphSelect');

    if (graphSelect) {

        graphSelect.addEventListener('change', function() {

            var selectedGraph = this.value;

            if (selectedGraph != "") {
                gallery.selectVisual(selectedGraph);
            }
        });
    }
}


function draw() {

    background(255);

    /*
     * Draw the visualisation currently selected
     * by the Gallery.
     */
    if (gallery != null &&
        gallery.selectedVisual != null) {

        gallery.selectedVisual.draw();
    }
}
