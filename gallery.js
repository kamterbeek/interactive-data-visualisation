function Gallery() {
    this.visuals = [];
    this.selectedVisual = null;

    this.addVisual = function(vis) {
        this.visuals.push(vis);

        // Add the visualisation to the original gallery menu.
        var menuItem = createElement("li", vis.name);
        menuItem.parent("visuals-menu");

        menuItem.mouseClicked(function() {
            gallery.selectVisual(vis.id);
        });

        // Load the data for the visualisation.
        vis.preload();
    };

    this.selectVisual = function(visId) {
        // Destroy the currently selected visualisation.
        if (this.selectedVisual != null &&
            this.selectedVisual.destroy != undefined) {

            this.selectedVisual.destroy();
        }

        // Find the requested visualisation.
        var index = this.findVisIndex(visId);

        if (index != -1) {
            this.selectedVisual = this.visuals[index];

            // Set up the selected visualisation.
            if (this.selectedVisual.setup != undefined) {
                this.selectedVisual.setup();
            }
        }
    };

    /*
    NEW: Find a visualisation using its ID. This is used by the new visualisation dropdown in index.html.
     */
    this.getVisualById = function(visId) {
        for (var i = 0; i < this.visuals.length; i++) {

            if (this.visuals[i].id == visId) {
                return this.visuals[i];
            }
        }

        return null;
    };

    this.findVisIndex = function(visId) {
        for (var i = 0; i < this.visuals.length; i++) {

            if (this.visuals[i].id == visId) {
                return i;
            }
        }

        return -1;
    };
}
