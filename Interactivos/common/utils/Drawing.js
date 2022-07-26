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
 * Given a list of points draw all the points on the screen
 * and change the position and color of a selected
 * point.
 * @param {Array} points - List of vectors representing
 * the points to draw.
 * @param {Point} selectedPoint - Vector representing
 * the selected point to move.
 */
function drawPointsWithSelection(points, selectedPoint, pointsColor=256, selectedColor="red") {
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
 * vectors representing the points on the convex hull.
 * @param {Boolean} isClosed - Add an arrow from the last
 * point in the array to the first point in the array, 
 * closing the cycle.
 */
function drawArrows(points,isClosed,color) {
    let size = points.length;
    strokeWeight(LINE_SIZE);
    last = points.length
    if(! isClosed){
        last--;
    }
    for (i = 0; i < last; i++) {
        let v0 = createVector(points[i].x, points[i].y);
        let v1 = createVector(points[(i + 1) % size].x, points[(i + 1) % size].y);
        drawArrow(v0, v1, color);
    }
}

/**
 * Given a clockwise sorted point list of all points in
 * the convex hull draw a line from pi to pj
 * where i = (j+1)%size with size equals the number of
 * points in the list.
 * @param {Array} points - Clockwise sorted point list of
 * vectors representing the points on the convex hull.
 * @param {Color} color - Color value for the lines 
 * that will be drawn
 */
function drawLines(points,color){
    let size = points.length
    strokeWeight(LINE_SIZE);
    stroke(color);
    for(i = 0; i < points.length; i++){
      line(points[i].x, points[i].y,points[(i+1)%size].x, points[(i+1)%size].y);
    }
}

/**
 * Given a clockwise sorted point list of all points in
 * the convex hull draw a line from pi to pj
 * where i = (j+1)%size with size equals the number of
 * points in the list.
 * @param {Array} points - Clockwise sorted point list of
 * vectors representing the points on the convex hull.
 * @param {Color} color - Color value for the lines 
 * that will be drawn
 */
 function drawLinesFromPoint(points, origin, color = 'red', ){
    strokeWeight(2);
    stroke(color);
    for(let point of points){
      line(origin.x, origin.y, point.x, point.y);
    }
}


/**
 * Given a sorted list of points, add a label with the 
 * position to each point.
 * @param {Array} points - Sorted list of points.
 * @param {Color} color - Color value for the lines 
 * that will be drawn
 */
 function drawOrder(points){
    noStroke();
    for (i = 0; i < points.length; i++) {
        push();
        textSize(POINT_SIZE/2);
        textAlign(CENTER);
        text(i+1, points[i].x-(POINT_SIZE/2), points[i].y-(POINT_SIZE/2));
        pop();
    }
}