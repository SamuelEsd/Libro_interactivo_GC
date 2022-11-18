let pointSet = new PointSet([]);
let cameraPoint;

function setup() {
  CUSTOM_WIDTH = windowWidth - 20;
  CUSTOM_HEIGHT = windowHeight - 20;

  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializePoints();
  collideDebug(true);
}

function initializePoints() {
  let startingP = createVector(WINDOW_BORDER, WINDOW_BORDER);
  let endingP = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  pointSet = new PointSet(getSimplePolygon(startingP, endingP));

  cameraPoint = new PointWatcher(
    createVector(
      startingP.x + (endingP.x - startingP.x),
      startingP.y + (endingP.y - startingP.y)
    )
  );
}

function touchMoved() {
  cameraPoint.setX(mouseX);
  cameraPoint.setY(mouseY);
}

function mouseClicked() {
  cameraPoint.setX(mouseX);
  cameraPoint.setY(mouseY);
}

function getNotCollidingPoints() {
  let not_colliding_points = [];
  let n = pointSet.size();
  for (let i = 0; i < n; ++i) {
    let x = pointSet.points[i].x;
    let y = pointSet.points[i].y;

    let collitions_to_poly = 0;
    for (let j = 0; j < n - 1; ++j) {
      let x1 = pointSet.points[j].x;
      let y1 = pointSet.points[j].y;
      let x2 = pointSet.points[j + 1].x;
      let y2 = pointSet.points[j + 1].y;
      if (
        collideLineLine(
          cameraPoint.getX(),
          cameraPoint.getY(),
          x,
          y,
          x1,
          y1,
          x2,
          y2
        )
      ) {
        collitions_to_poly++;
      }
      if (collitions_to_poly > 2) {
        continue;
      }
    }
    if (collitions_to_poly < 3) {
      not_colliding_points.push(pointSet.points[i]);
    }
  }
  return not_colliding_points;
}

function draw() {
  background(0);
  let point_insisde = cameraPoint.isInSimplePolygon(pointSet.points);
  if (point_insisde) {
    let not_colliding_points = getNotCollidingPoints();

    // Get all angles
    var angles = [];
    for (var j = 0; j < not_colliding_points.length; j++) {
      var not_colliding_point = not_colliding_points[j];
      var angle = Math.atan2(
        not_colliding_point.y - cameraPoint.getY(),
        not_colliding_point.x - cameraPoint.getX()
      );
      if (
        j - 1 < 0 ||
        not_colliding_point[j - 1] != not_colliding_point[j] - 1
      ) {
        angles.push(angle - 0.00001);
      }
      angles.push(angle);
      if (
        j + 1 >= not_colliding_points.length ||
        not_colliding_point[j + 1] != not_colliding_point[j] + 1
      ) {
        angles.push(angle + 0.00001);
      }
    }

    // RAYS IN ALL DIRECTIONS
    var intersects = [];
    for (let i = 0; i < angles.length; i++) {
      var angle = angles[i];

      // Calculate dx & dy from angle
      let direction = {
        x: cameraPoint.getX() + Math.cos(angle),
        y: cameraPoint.getY() + Math.sin(angle),
      };

      // Find CLOSEST intersection
      var closestIntersect = null;
      let n = pointSet.size();
      for (let j = 0; j < n - 1; ++j) {
        let x1 = pointSet.points[j].x;
        let y1 = pointSet.points[j].y;
        let x2 = pointSet.points[j + 1].x;
        let y2 = pointSet.points[j + 1].y;
        segment = {
          a: { x: x1, y: y1 },
          b: { x: x2, y: y2 },
        };
        var intersect = cameraPoint.cast(direction, segment);
        if (!intersect) continue;
        if (!closestIntersect || intersect.dist < closestIntersect.dist) {
          closestIntersect = intersect;
        }
      }

      // Add to list of intersects
      if (closestIntersect) {
        closestIntersect.angle = angle;
        intersects.push(closestIntersect);
      }
    }
    sorted_intersections = intersects.sort(function (a, b) {
      return a.angle - b.angle;
    });
    //no_collition_point_set = new PointSet(intersects);
    push();
    noStroke();
    beginShape(TESS);
    for (const { x, y } of sorted_intersections) vertex(x, y);
    endShape(CLOSE);
    pop();
    //no_collition_point_set.drawLinesFromPoint(cameraPoint.getPoint());
  }
  cameraPoint.draw(point_insisde ? "red" : "blue", POINT_SIZE / 4);
  pointSet.drawLinesBetweenPoints(true, "green", LINE_SIZE / 2);
}
