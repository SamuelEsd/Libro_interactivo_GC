class PointSet {
  points;

  constructor(points) {
    this.points = points;
  }

  /**
   * Draws all the PointSet points on the screen.
   * @param {Color} color - Color of the points to be drawn.
   */
  drawPoints(color) {
    noStroke();
    for (i = 0; i < this.points.length; i++) {
        push();
        fill(255);
        stroke(color);
        strokeWeight(3);
        circle(this.points[i].x, this.points[i].y, POINT_SIZE);
        pop();
        if(points[i].z > 0){
            push();
            textSize(POINT_SIZE/2);
            textAlign(CENTER);
            text('P'+(this.points[i].z), this.points[i].x, this.points[i].y+(POINT_SIZE/4));
            pop();
        }
    }
  }

  /**
   * Returns the lowest point in the PointSet.
   * @return {Point} the lowest point in the PointSet.
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
   * Returns the PointSet as a string using z coordinate as
   * the id of each point.
   * @return {String} the PointSet as a String.
   */
  toString() {
    let desc = '';
    for (let currPoint of this.points) {
      desc += `P${currPoint.z} `;
    }
    return desc;
  }

  size() {
    return this.points.length;
  }
}
