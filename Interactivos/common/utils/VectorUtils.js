/**
 * Given three points, returns the direction of
 * the turn that make the segment of the second
 * and third point with respect to the segment
 * of the first and second points.
 * @param {Vector} origin - First of three points.
 * @param {Vector} v1 - Second of three points.
 * @param {Color} v2 - Third of three points
 * @return 1 if the turn is clockwise,
 * -1 if the turn is counterclockwise,
 * 0 it points are colinear.
 */
function turnDirection(origin, v1, v2) {
  crossProduct =
    (v1.y - origin.y) * (v2.x - origin.x) -
    (v1.x - origin.x) * (v2.y - origin.y);
  if (crossProduct > 0) {
    return -1;
  }
  if (crossProduct < 0) {
    return 1;
  }
  return 0;
}

/**
 * Sort all the points in counter clockwise order with
 * respect to the given point of reference.
 * @param {Vector} origin - Starting point of the
 * arrow.
 * @param {Vector} v1 - Starting point of the
 * arrow.
 * @param {Color} v2 - Color of the arrow.
 */
function sortCounterClockWise(points, reference_point) {
  points.sort(function (p1, p2) {
    if (p1 === reference_point) {
      return -1;
    }
    if (p2 === reference_point) {
      return 1;
    }

    let is_clock_wise = turnDirection(reference_point, p1, p2);

    if (is_clock_wise === 0) {
      if (p1.x === p2.x) {
        return p1.y < p2.y ? -1 : 1;
      } else {
        return p1.x < p2.x ? -1 : 1;
      }
    }
    return is_clock_wise;
  });
}

/**
 * Calculate the euclid distance of a pair
 * of two dimensional points.
 * @param {Vector} v1 - First point.
 * @param {Vector} v2 - Second point.
 */
function distance(v1, v2) {
  return sqrt(pow(v2.x - v1.x, 2) + pow(v2.y - v1.y, 2));
}

/**
 * Create an array of vectors representing the points created
 * among the specified limits.
 * @param {Integer} num_of_points - Number of points
 * to be created among the specified limits.
 * @param {Vector} startingP - Point representing the left and top
 * limits of the area to create points.
 * @param {Vector} endingP - Point representing the right and bottom
 * limits of the area to create points.
 */
function getRandomPointsInArea(num_of_points, startingP, endingP) {
  let points = [];
  for (let i = 0; i < num_of_points; i++) {
    let new_x = Math.ceil(random(startingP.x, endingP.x));
    let new_y = Math.ceil(random(startingP.y, endingP.y));
    points.push(createVector(new_x, new_y, i + 1));
  }
  return points;
}

/**
 * Create an array of vectors representing the points created
 * among the specified limits.
 * @param {Integer} num_of_points - Number of points
 * to be created among the specified limits.
 * @param {Vector} startingP - Point representing the left and top
 * limits of the area to create points.
 * @param {Vector} endingP - Point representing the right and bottom
 * limits of the area to create points.
 */
function getSimplePolygon(startingP, endingP) {
  points = [];
  let x_units = Math.floor((endingP.x - startingP.x) / 100);
  let y_units = Math.floor((endingP.y - startingP.y) / 100);
  let i = 0;
  points.push(
    createVector(startingP.x + x_units * 0, startingP.y + y_units * 0, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 100, startingP.y + y_units * 0, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 100, startingP.y + y_units * 50, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 85, startingP.y + y_units * 50, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 85, startingP.y + y_units * 25, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 60, startingP.y + y_units * 25, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 60, startingP.y + y_units * 28, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 82, startingP.y + y_units * 28, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 82, startingP.y + y_units * 60, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 60, startingP.y + y_units * 60, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 60, startingP.y + y_units * 85, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 62, startingP.y + y_units * 85, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 62, startingP.y + y_units * 63, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 82, startingP.y + y_units * 63, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 82, startingP.y + y_units * 100, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 50, startingP.y + y_units * 100, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 50, startingP.y + y_units * 85, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 27, startingP.y + y_units * 85, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 27, startingP.y + y_units * 28, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 48, startingP.y + y_units * 28, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 48, startingP.y + y_units * 55, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 50, startingP.y + y_units * 55, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 50, startingP.y + y_units * 25, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 25, startingP.y + y_units * 25, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 25, startingP.y + y_units * 55, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 15, startingP.y + y_units * 55, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 15, startingP.y + y_units * 58, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 25, startingP.y + y_units * 58, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 25, startingP.y + y_units * 100, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 0, startingP.y + y_units * 100, i + 1)
  );

  points.push(
    createVector(startingP.x + x_units * 0, startingP.y + y_units * 28, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 15, startingP.y + y_units * 28, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 15, startingP.y + y_units * 25, i + 1)
  );
  points.push(
    createVector(startingP.x + x_units * 0, startingP.y + y_units * 25, i + 1)
  );
  return points;
}

/**
 * Returns a P5.js Vector corresponding to the intersection
 * of the line formed by the point1 and point2, and the
 * line formed by the point3 and point4.
 * @param {Vector} point1 - Point representing the start of
 * the first line.
 * @param {Vector} point2 - Point representing the end of
 * the first line.
 * @param {Vector} point3 - Point representing the start of
 * the second line.
 * @param {Vector} point4 - Point representing the end of
 * the second line.
 */
function intersect_point(point1, point2, point3, point4) {
  let ua =
    ((point4.x - point3.x) * (point1.y - point3.y) -
      (point4.y - point3.y) * (point1.x - point3.x)) /
    ((point4.y - point3.y) * (point2.x - point1.x) -
      (point4.x - point3.x) * (point2.y - point1.y));

  let ub =
    ((point2.x - point1.x) * (point1.y - point3.y) -
      (point2.y - point1.y) * (point1.x - point3.x)) /
    ((point4.y - point3.y) * (point2.x - point1.x) -
      (point4.x - point3.x) * (point2.y - point1.y));

  let x = point1.x + ua * (point2.x - point1.x);
  let y = point1.y + ua * (point2.y - point1.y);

  return createVector(x, y, 0);
}

/**
 * Initialize constants used to delimit the
 * corners of the canvas where the animations
 * will be drawn.
 */
function initializeCorners() {
  MIDDLE_WIDTH = Math.ceil(CUSTOM_WIDTH / 2);

  UP_LEFT_CORNER = createVector(WINDOW_BORDER, WINDOW_BORDER);
  DOWN_MIDDLE_CORNER = createVector(
    MIDDLE_WIDTH - 20,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  UP_MIDDLE_CORNER = createVector(MIDDLE_WIDTH + 20, WINDOW_BORDER);
  DOWN_RIGHT_CORNER = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
}
