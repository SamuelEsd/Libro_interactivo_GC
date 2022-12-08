/**
 * Draw an arrow for a point A to point B.
 * @param {Vector} start - Starting point of the
 * arrow.
 * @param {Vector} end - Starting point of the
 * arrow.
 * @param {Color} color - Color of the arrow.
 */
function drawArrow(start, end, myColor, size = LINE_SIZE) {
  push();
  stroke(myColor);
  strokeWeight(size);
  fill(myColor);
  // first draw a line
  let resultantVect = createVector(end.x - start.x, end.y - start.y);
  translate(start.x, start.y);
  line(0, 0, resultantVect.x, resultantVect.y);
  rotate(resultantVect.heading());
  // then draw a triangle
  let arrowSize = size * 2;
  translate(resultantVect.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
/**
 * Draw an arrow for a point A to point B.
 * @param {Vector} start - Starting point of the
 * arrow.
 * @param {Vector} end - Starting point of the
 * arrow.
 * @param {Color} color - Color of the arrow.
 */
function drawArrowToRight(start, end, myColor, size = LINE_SIZE) {
  push();
  stroke(myColor);
  strokeWeight(size);
  fill(myColor);
  // first draw a line
  let resultantVect = createVector(end.x - start.x, end.y - start.y);
  translate(start.x, start.y);
  rotate(resultantVect.heading());
  translate(0, -size);
  line(size * 4, 0, resultantVect.mag() - size * 4, 0);
  // then draw a triangle
  let arrowSize = size;
  translate(resultantVect.mag() - size * 4 - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

/**
 * Draw an arrow for a point A to point B.
 * @param {Vector} start - Starting point of the
 * arrow.
 * @param {Vector} end - Starting point of the
 * arrow.
 * @param {Color} color - Color of the arrow.
 */
function drawDirectedLine(start, end, myColor) {
  push();
  stroke(myColor);
  strokeWeight(LINE_SIZE);
  fill(myColor);
  let resultantVect = createVector(end.x - start.x, end.y - start.y);
  translate(start.x, start.y);
  push();
  drawingContext.setLineDash([5, 10]);
  line(0, 0, resultantVect.x * 3, resultantVect.y * 3);
  pop();
  rotate(resultantVect.heading());
  // then draw a triangle
  let arrowSize = LINE_SIZE * 2;
  translate(resultantVect.mag() - (arrowSize + POINT_SIZE / 2), 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

/**
 * Given a sorted list of points, add a label with the
 * position to each point.
 * @param {Array} points - Sorted list of points.
 * @param {Color} color - Color value for the lines
 * that will be drawn
 */
function drawOrder(points) {
  noStroke();
  for (i = 0; i < points.length; i++) {
    push();
    textSize(POINT_SIZE / 2);
    textAlign(CENTER);
    text(i + 1, points[i].x - POINT_SIZE / 2, points[i].y - POINT_SIZE / 2);
    pop();
  }
}
