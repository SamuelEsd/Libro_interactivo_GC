let left_pointsSet = new PointSet([]);
let right_pointsSet = new PointSet([]);
let left_convexHull = new PointSet([]);
let right_convexHull = new PointSet([]);

let curr_index_left;
let curr_index_right;

let new_tangent = new PointSet([]);
let lower_tangent = new PointSet([]);
let intersecting_points = new PointSet([]);

let reset = false;
let start = true;
let checkLeft;
let checkRight;
let changesOnLeft;
let changesOnRight;
let middleLine_end;
let middleLine_start;

let highest_intersection;
let lowest_intersection;
let num_of_points = 10;
let displayTangents = false;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 180;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeCorners();
  middleLine_start = createVector(MIDDLE_WIDTH, WINDOW_BORDER);
  middleLine_end = createVector(MIDDLE_WIDTH, CUSTOM_HEIGHT - WINDOW_BORDER);

  button = createButton("");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
  description = createElement("h3", "");
  inputDescription = createElement("h4", "");
  outputDescription = createElement("h4", "");

  resetAlgorithm();
}

function resetAlgorithm() {
  left_pointsSet = new PointSet(
    getRandomPointsInArea(
      Math.floor(num_of_points / 2),
      UP_LEFT_CORNER,
      DOWN_MIDDLE_CORNER
    )
  );
  right_pointsSet = new PointSet(
    getRandomPointsInArea(
      Math.ceil(num_of_points / 2),
      UP_MIDDLE_CORNER,
      DOWN_RIGHT_CORNER
    )
  );

  left_convexHull = new PointSet(convexHullJM(left_pointsSet.points));
  right_convexHull = new PointSet(convexHullJM(right_pointsSet.points));

  new_tangent.points = [];
  lower_tangent.points = [];

  checkLeft = true;
  checkRight = true;
  (changesOnLeft = true),
    (changesOnRight = true),
    (lowest_intersection = middleLine_end.y);

  description.html("Para iniciar la visualización presione el botón iniciar.");
  button.html("Iniciar");
}

async function step() {
  // Initialize the first posible lower tangent
  if (start === true) {
    curr_index_left = left_convexHull.getRightmostPointIndex();
    curr_index_right = right_convexHull.getLeftmostPointIndex();

    lower_tangent.push(left_convexHull.points[curr_index_left]);
    lower_tangent.push(right_convexHull.points[curr_index_right]);
    lowest_intersection = intersect_point(
      middleLine_start,
      middleLine_end,
      lower_tangent.points[0],
      lower_tangent.points[1]
    ).y;
    description.html(
      "Tomamos los puntos puntos más a la derecha y mas a a izquierda de los cierres izquierdo y derecho respectivamente."
    );
    button.html("Siguiente");
    start = false;
  }
  // if tangent point has been modified in at least one side, we need to check
  // if a lower tangen can be found.
  else if (changesOnLeft || changesOnRight) {
    if (new_tangent.size() == 0) {
      if (checkLeft) {
        mod = left_convexHull.size();
        new_tangent.push(
          left_convexHull.points[(curr_index_left - 1 + mod) % mod]
        );
        new_tangent.push(right_convexHull.points[curr_index_right]);
        description.html(
          "Comparamos la tangente actual con una nueva usando el punto que precede al punto usado en el cierre  convexo izquierdo."
        );
      } else {
        mod = right_convexHull.size();
        new_tangent.push(left_convexHull.points[curr_index_left]);
        new_tangent.push(
          right_convexHull.points[(curr_index_right + 1 + mod) % mod]
        );
        description.html(
          "Comparamos la tangente actual con una nueva usando el punto que procede al punto usado en el cierre convexo derecho."
        );
      }
      return;
    } else {
      let intersecting_point = intersect_point(
        middleLine_start,
        middleLine_end,
        new_tangent.points[0],
        new_tangent.points[1]
      );
      // if the line from left point to right point is a new tangent
      // update the tangent value
      if (intersecting_point.y > lowest_intersection) {
        lowest_intersection = intersecting_point.y;
        lower_tangent.points = [new_tangent.points[0], new_tangent.points[1]];
        if (checkLeft) {
          curr_index_left--;
          changesOnLeft = true;
        } else {
          curr_index_right++;
          changesOnRight = true;
        }
        new_tangent.points = [];
        description.html("Tomamos esta nueva línea como la tangente inferior.");
      } else {
        new_tangent.points = [];
        if (checkLeft) {
          checkLeft = false;
          changesOnRight = false;
          description.html(
            "La nueva línea no es inferior a la actual, entonces intentamos mover el punto del cierre convexo derecho."
          );
        } else {
          checkRight = false;
          changesOnLeft = false;
          checkLeft = true;
          description.html(
            "La nueva línea no es inferior a la actual, entonces intentamos mover el punto del cierre convexo izquierdo."
          );
        }
      }
    }
  } else {
    // reset alg
    if (reset) {
      resetAlgorithm();
      start = true;
      reset = false;
    } else {
      description.html("La tangente inferior ha sido encontrada.");
      button.html("Reiniciar");
      reset = true;
    }
  }

  tangent_point_names = lower_tangent.toString().split(" ");
  inputDescription.html(
    "Tangente inferior actual:<br>Cierre izquierdo:" +
      tangent_point_names[0] +
      " Cierre derecho:" +
      tangent_point_names[1]
  );
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(0);
  // Draws the line from the left convex hull to the right convex hull
  drawCHs();
  drawMiddleLine();
  lower_tangent.drawPoints("red");
}

function drawCHs() {
  left_convexHull.drawLinesBetweenPoints(true, "green");
  right_convexHull.drawLinesBetweenPoints(true, "green");

  lower_tangent.drawLinesBetweenPoints(false, "yellow", 2);
  if (new_tangent.size() != 0) {
    new_tangent.drawLinesBetweenPoints(false, "yellow", 2);
  }

  left_pointsSet.drawPoints("blue");
  right_pointsSet.drawPoints("blue");
}

function drawMiddleLine() {
  push();
  stroke("red");
  strokeWeight(2);
  line(
    middleLine_start.x,
    middleLine_start.y,
    middleLine_end.x,
    middleLine_end.y
  );
  pop();
  intersecting_points.drawPointsNoId("yellow", 3);
}
