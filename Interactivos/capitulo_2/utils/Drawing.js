/**
 * Draw an arrow for a point A to point B.
 * @param {Vector} start - Starting point of the
 * arrow.
 * @param {Vector} end - Starting point of the
 * arrow.
 * @param {Color} color - Color of the arrow.
 */
function drawArrow(start, end, myColor) {
    push();
    stroke(myColor);
    strokeWeight(LINE_SIZE);
    fill(myColor);
    // first draw a line
    let resultantVect = createVector(end.x - start.x, end.y - start.y);
    translate(start.x, start.y);
    line(0, 0, resultantVect.x, resultantVect.y);
    rotate(resultantVect.heading());
    // then draw a triangle
    let arrowSize = LINE_SIZE;
    translate(resultantVect.mag() - (arrowSize + POINT_SIZE / 2), 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}

/**
 * Given a list of points draw all the points on the screen.
 * @param {Array} points - List of vectors representing
 * the points to draw.
 */
function drawPoints(points) {
    strokeWeight(POINT_SIZE);
    for (i = 0; i < points.length; i++) {
        stroke(256);
        point(points[i].x, points[i].y);
    }
}

/**
 * Given a list of points draw all the points on the screen
 * and change the position and color of a selected
 * point.
 * @param {Array} points - List of vectors representing
 * the points to draw.
 * @param {Point} points - Vector representing
 * the selected point to move.
 */
function drawPointsWithSelection(points, selectedPoint) {
    strokeWeight(POINT_SIZE);
    for (i = 0; i < points.length; i++) {
        if (selectedPoint == i) {
            stroke("red");
            points[i].x = mouseX;
            points[i].y = mouseY;
        } else {
            stroke(256);
        }
        point(points[i].x, points[i].y);
    }
}

/**
 * Given a clockwise sorted point list of all points in
 * the convex hull draw an arrow from pi to pj
 * where i = (j+1)%size with size equals the number of
 * points in the list.
 * @param {Array} points - Clockwise sorted point list of
 * vectors representing the points on the coonvex hull.
 */
function drawCH(points) {
    let size = points.length;
    strokeWeight(LINE_SIZE);
    stroke("green");
    for (i = 0; i < points.length; i++) {
        let v0 = createVector(points[i].x, points[i].y);
        let v1 = createVector(points[(i + 1) % size].x, points[(i + 1) % size].y);
        drawArrow(v0, v1, "green");
    }
}
