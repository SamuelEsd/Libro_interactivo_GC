class PointSet {
  points;

  constructor(points) {
    this.points = points;
  }

  // Array related functions

  /**
   * Removes the first element from the points array and returns it.
   * If the points array is empty, undefined is returned
   * and the points array is not modified.
   */
  shift() {
    return this.points.shift();
  }

  /**
   * Appends new elements to the end of the points array, and returns the new length of the array.
   * @param items — New elements to add to the points array.
   */
  push(items) {
    this.points.push(items);
  }
  /**
   * Removes the last element from the points array
   * and returns it. If the array is empty,
   * undefined is returned and the array is not modified.
   * @returns the last element from the points array if
   * it is present, undefined in eny other case.
   */
  pop() {
    return this.points.pop();
  }

  size() {
    return this.points.length;
  }

  /**
   * Returns the PointSet as a string using z coordinate as
   * the id of each point.
   * @return {String} the PointSet as a String.
   */
  toString() {
    let desc = "";
    for (let currPoint of this.points) {
      desc += `P${currPoint.z} `;
    }
    return desc;
  }
  
  setIds() {
    let i = 1;
    for (let currPoint of this.points) {
      currPoint.z = i++;
    }
  }

  // DRAWING related functions

  /**
   * Draws all the PointSet points on the screen,
   * with a line of an specific color, surrounding the points.
   * If the coordinate z is greater than 0, it will be considered
   * as the ID i of the point, and it will be displayed on the
   * center of the point as Pi.
   * @param {Color} color - Color of the points to be drawn.
   */
  drawPoints(color) {
    noStroke();
    for (let i = 0; i < this.points.length; i++) {
      push();
      fill(255);
      stroke(color);
      strokeWeight(3);
      circle(this.points[i].x, this.points[i].y, POINT_SIZE);
      pop();
      if (this.points[i].z != null && this.points[i].z > 0) {
        push();
        textSize(POINT_SIZE / 2);
        textAlign(CENTER);
        text(
          "P" + this.points[i].z,
          this.points[i].x,
          this.points[i].y + POINT_SIZE / 4
        );
        pop();
      }
    }
  }

  /**
   * Draws all the PointSet points on the screen,
   * with a line of an specific color, surrounding the points.
   * If the coordinate z is greater than 0, it will be considered
   * as the ID i of the point, and it will be displayed on the
   * center of the point as Pi.
   * @param {Color} color - Color of the points to be drawn.
   */
  drawPointsNoId(color, point_size) {
    noStroke();
    for (let i = 0; i < this.points.length; i++) {
      push();
      fill(255);
      stroke(color);
      strokeWeight(3);
      circle(this.points[i].x, this.points[i].y, point_size);
      pop();
    }
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
  drawPointsWithSelection(
    selectedPoint,
    pointsColor = 256,
    selectedColor = "red"
  ) {
    strokeWeight(POINT_SIZE);
    for (i = 0; i < points.length; i++) {
      if (selectedPoint == i) {
        stroke("red");
        this.points[i].x = mouseX;
        this.points[i].y = mouseY;
      } else {
        stroke(256);
      }
      point(this.points[i].x, this.points[i].y);
    }
  }
  /**
   * Given an origin point, draw a line from origin point
   * to all points in PointSet.
   * @param {Point} origin - Point from where the
   * lines to be drawn will start.
   * @param {Color} color - Color value for the lines
   * to be drawn.
   */
  drawLinesFromPoint(origin, color = "red") {
    strokeWeight(3);
    stroke(color);
    for (let point of this.points) {
      line(origin.x, origin.y, point.x, point.y);
    }
  }

  /**
   * Draw an arrow from every point in the PointSet
   * array to the next point in the order they appear
   * in the array.
   * If isClosed is true, the arrow from the last
   * point in the array to the first point in
   * the array will be drawn.
   * @param {Boolean} isClosed - Boolean value, to
   * decide whether or not to add an arrow from the last
   * point in the array to the first point in the array,
   * closing the cycle.
   */
  drawArrowsBetweenPoints(isClosed, color = "green", weight = LINE_SIZE) {
    this.#drawFigureBetweenPoints(isClosed, color, "arrow", weight);
  }

  /**
   * Draw a line from every point in the PointSet
   * array to the next point in the order they appear
   * in the array.
   * If isClosed is true, the line from the last
   * point in the array to the first point in
   * the array will be drawn.
   * @param {Boolean} isClosed - Boolean value, to
   * decide whether or not to add an arrow from the last
   * point in the array to the first point in the array,
   * closing the cycle.
   */
  drawLinesBetweenPoints(isClosed, color = "green", weight = LINE_SIZE) {
    this.#drawFigureBetweenPoints(isClosed, color, "line", weight);
  }

  #drawFigureBetweenPoints(isClosed, color, figure, weight) {
    let size = this.points.length;
    strokeWeight(weight);
    stroke(color);
    let last = this.points.length;
    if (!isClosed) {
      last--;
    }
    for (let i = 0; i < last; i++) {
      if (figure === "line") {
        push();
        line(
          this.points[i].x,
          this.points[i].y,
          this.points[(i + 1) % size].x,
          this.points[(i + 1) % size].y
        );
        pop();
      }
      if (figure === "arrow") {
        let v0 = createVector(this.points[i].x, this.points[i].y);
        let v1 = createVector(
          this.points[(i + 1) % size].x,
          this.points[(i + 1) % size].y
        );
        drawArrow(v0, v1, color);
      }
    }
  }

  /**
   * Returns the lowest point in the PointSet.
   * @return {Vector} the lowest point in the PointSet.
   */
  getLowestPoint() {
    let minYPoint = this.points[0];
    for (let point of this.points) {
      if (
        point.y > minYPoint.y ||
        (point.y == minYPoint.y && point.x > minYPoint.x)
      ) {
        minYPoint = point;
      }
    }
    return minYPoint;
  }

  /**
   * Returns the leftmost point in the PointSet.
   * @return {Vector} the leftmost point in the PointSet.
   */
  getLeftmostPointIndex() {
    let minXPoint = 0;
    for (let i = 0; i < this.size(); i++) {
      let point = this.points[i];
      if (
        point.x < this.points[minXPoint].x ||
        (point.x == this.points[minXPoint].x &&
          point.y > this.points[minXPoint].y)
      ) {
        minXPoint = i;
      }
    }
    return minXPoint;
  }

  /**
   * Returns the rightmost point in the PointSet.
   * @return {Vector} the rightmost point in the PointSet.
   */
  getRightmostPointIndex() {
    let maxXPoint = 0;
    for (let i = 0; i < this.size(); i++) {
      let point = this.points[i];
      if (
        point.x > this.points[maxXPoint].x ||
        (point.x == this.points[maxXPoint].x &&
          point.y > this.points[maxXPoint].y)
      ) {
        maxXPoint = i;
      }
    }
    return maxXPoint;
  }
}
