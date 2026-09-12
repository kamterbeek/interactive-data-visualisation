function PieChart(parent, data) {
    this.parent = parent;
    this.data = data;

    this.draw = function() {
        var total = 0;

        for (var i = 0; i < this.data.length; i++) {
            total += this.data[i].value;
        }

        var lastAngle = 0;

        for (var i = 0; i < this.data.length; i++) {

            var angle = map(
                this.data[i].value,
                0,
                total,
                0,
                TWO_PI
            );

            fill(this.data[i].colour);

            arc(
                this.parent.width / 2,
                this.parent.height / 2,
                this.parent.width,
                this.parent.height,
                lastAngle,
                lastAngle + angle
            );

            lastAngle += angle;
        }
    };
}
