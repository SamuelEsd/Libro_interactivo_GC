class PointWatcher {
  constructor(point) {
    this.point = point;
  }

  setX(num) {
    this.point.x = num;
  }

  setY(num) {
    this.point.y = num;
  }

  getPoint() {
    return this.point;
  }

  getX() {
    return this.point.x;
  }

  getY() {
    return this.point.y;
  }

  isInSimplePolygon(simplePolygon) {
    let n = simplePolygon.length;
    let is_in = false;
    let x = this.point.x;
    let y = this.point.y;

    for (let i = 0; i < n - 1; ++i) {
      let x1 = simplePolygon[i].x;
      let x2 = simplePolygon[i + 1].x;
      let y1 = simplePolygon[i].y;
      let y2 = simplePolygon[i + 1].y;

      if (y < y1 != y < y2 && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
        is_in = !is_in;
      }
    }

    return is_in;
  }

  /**
   * Draws all the PointSet points on the screen,
   * with a line of an specific color, surrounding the points.
   * If the coordinate z is greater than 0, it will be considered
   * as the ID i of the point, and it will be displayed on the
   * center of the point as Pi.
   * @param {Color} color - Color of the points to be drawn.
   */
  draw(color, point_size = POINT_SIZE) {
    noStroke();
    push();
    fill(255);
    stroke(color);
    strokeWeight(3);
    circle(this.point.x, this.point.y, point_size);
    pop();
  }

  cast(direction, segment) {
    const x1 = segment.a.x;
    const y1 = segment.a.y;
    const x2 = segment.b.x;
    const y2 = segment.b.y;

    const x3 = this.point.x;
    const y3 = this.point.y;
    const x4 = direction.x;
    const y4 = direction.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    // if (den == 0) {
    //   return;
    // }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      return {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
        dist: u,
      };
    } else {
      return;
    }
  }
}
