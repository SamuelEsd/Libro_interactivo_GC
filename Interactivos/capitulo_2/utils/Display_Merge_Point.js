let pointsSet = new PointSet([]);
let convexHull = new PointSet([]);

let curr_index;
let curr_edge = new PointSet([]);
let point_to_add = new PointSet([]);

let tangent_a = new PointSet([]);
let tangent_b = new PointSet([]);

let isRightTurn = null;
let iterations = 0;
let arrowColor = null;
let prev_turn_dir = null;
let ch_point_before_new_point = null;
let ch_point_after_new_point = null;

let restart_algorithm = false;
let num_of_points = 10;
let new_point_id = 3;

let rightTurnColor;
let leftTurnColor;

// Vars used for the visualizations of steps
let button;
let description;

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 180;
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeCorners();

  button = createButton("");
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
  description = createElement("h3", "");
  inputDescription = createElement("h4", "");
  outputDescription = createElement("h4", "");
  rightTurnColor = color(0, 0, 256, 180);
  leftTurnColor = color(256, 256, 256, 180);

  resetAlgorithmToBeginning();
}

/**
 * Simple function to reset all variables used in the algorithm.
 * The algorithm is restarted when new_point_id reaches num_of_points
 */
function resetAlgorithmToBeginning() {
  pointsSet = convexHullJM(
    getRandomPointsInArea(Math.floor(3), UP_LEFT_CORNER, DOWN_RIGHT_CORNER)
  );

  convexHull = new PointSet(convexHullJM(pointsSet));
  convexHull.setIds();
  removeExtras();

  iterations = 0;
  restart_algorithm = false;
  prev_turn_dir = null;
  ch_point_before_new_point = null;
  ch_point_after_new_point = null;
  new_point_id = 3;

  description.html("Para iniciar la visualización presione el botón iniciar.");
  button.html("Iniciar");
}

/**
 * Updates current convex hull with the new point
 * keeping all previous points except for the ones that
 * does not belong to the convex hull anymore.
 */
function updateConvexHull() {
  let new_convexHull = [];
  let before_less_than_after =
    ch_point_before_new_point < ch_point_after_new_point;
  for (let i = 0; i < convexHull.size(); i++) {
    if (
      before_less_than_after &&
      (i <= ch_point_before_new_point || i >= ch_point_after_new_point)
    ) {
      if (i == ch_point_after_new_point) {
        new_convexHull.push(point_to_add.points[0]);
      }
      new_convexHull.push(convexHull.points[i]);
    }
    if (
      !before_less_than_after &&
      i >= ch_point_after_new_point &&
      i <= ch_point_before_new_point
    ) {
      new_convexHull.push(convexHull.points[i]);
      if (i == ch_point_before_new_point) {
        new_convexHull.push(point_to_add.points[0]);
      }
    }
  }
  convexHull.points = new_convexHull;
}

function removeExtras() {
  curr_edge.points = [];
  point_to_add.points = [];
  tangent_a.points = [];
  tangent_b.points = [];
  isRightTurn = null;
  prev_turn_dir = null;
  arrowColor = null;
  iterations = 0;
}

function addRandomPoint() {
  let new_random_point = getRandomPointsInArea(
    1,
    UP_LEFT_CORNER,
    DOWN_RIGHT_CORNER
  )[0];
  new_point_id += 1;
  new_random_point.z = new_point_id;

  point_to_add.push(new_random_point);
  curr_index = 0;
}

/**
 * Finishes the current adding point iteration.
 * The iteration finishes when the tanges were found
 * or when we know the point to add is inside the convex hull.
 */
function finishIteration() {
  if (restart_algorithm) {
    return;
  }
  // Finish convex hull
  if (iterations > convexHull.size() + 1) {
    description.html(
      "Ya se revisaron todas las aristas y todas son vueltas izquierdas, entonces el punto estaba dentro del cierre convexo y este permanece igual."
    );
  } else {
    description.html(
      "Ya se encontraron las tangentes y se puede formar el nuevo cierre convexo."
    );
    updateConvexHull();
  }
}

/**
 * Resets the variables in order to start a new iteration
 * or to start the algorithm from the beginning again.
 */
function resetAlgorithm() {
  if (restart_algorithm) {
    resetAlgorithmToBeginning();
  }
  if (new_point_id == num_of_points - 1) {
    button.html("Reiniciar");
    restart_algorithm = true;
  }
  removeExtras();
}

function getCurrentTurnDirection() {
  isRightTurn =
    turnDirection(
      curr_edge.points[0],
      curr_edge.points[1],
      point_to_add.points[0]
    ) == 1;
  if (isRightTurn) {
    let need_to_add_first_tangent =
      prev_turn_dir != null && prev_turn_dir != "right";
    if (need_to_add_first_tangent) {
      description.html(
        "El nuevo punto da vuelta derecha y la anterior fue izquierda, entonces el primer punto de la arista actual forma parte de una tangente."
      );
      tangent_a.push(point_to_add.points[0]);
      tangent_a.push(curr_edge.points[0]);
      ch_point_before_new_point =
        (curr_index + (convexHull.size() - 1)) % convexHull.size();
    } else {
      description.html("El nuevo punto da vuelta derecha.");
    }
    arrowColor = rightTurnColor;
    prev_turn_dir = "right";
  }
  // isLeftTurn
  else {
    let need_to_add_second_tangent =
      prev_turn_dir != null && prev_turn_dir == "right";
    if (need_to_add_second_tangent) {
      description.html(
        "El nuevo punto da vuelta izquierda y la anterior fue derecha, entonces el primer punto de la arista actual forma parte de una tangente."
      );
      tangent_b.push(point_to_add.points[0]);
      tangent_b.push(curr_edge.points[0]);
      ch_point_after_new_point =
        (curr_index + (convexHull.size() - 1)) % convexHull.size();
    } else {
      description.html("El nuevo punto da vuelta izquierda.");
    }
    arrowColor = leftTurnColor;
    prev_turn_dir = "left";
  }
}

async function step() {
  let tangents_found = tangent_a.size() != 0 && tangent_b.size() != 0;
  let iterations_completed = iterations > convexHull.size() + 1;

  let need_to_add_new_point = point_to_add.size() == 0;
  let need_to_iterate_new_edge = curr_edge.size() == 0;

  if (tangents_found || iterations_completed) {
    finishIteration();
    resetAlgorithm();
  } else if (need_to_add_new_point) {
    addRandomPoint();
    description.html("Agregamos un punto aleatorio.");
    button.html("Siguiente");
  } else if (need_to_iterate_new_edge) {
    curr_edge.push(convexHull.points[curr_index]);
    curr_index = (curr_index + 1) % convexHull.size();
    curr_edge.push(convexHull.points[curr_index]);
    iterations++;

    description.html(
      "Tomaremos dos puntos del cierre convexo actual, para calcular que tipo de vuelta se dará."
    );
    inputDescription.html(convexHull);
    button.html("Siguiente");
  }
  // Check the direction of the turn of the point p and the current edge.
  else {
    let need_to_get_current_turn_direction = isRightTurn === null;
    if (need_to_get_current_turn_direction) {
      console.log("get the direction");
      getCurrentTurnDirection();
    }
    // We know current turn direction, we have to erase it in order to get the next one
    else {
      console.log("know the direction");
      curr_edge.points = [];
      isRightTurn = null;
      arrowColor = null;
    }
  }

  if (curr_edge.size() != 0) {
    let curr_edge_points = curr_edge.toString().split(" ");
    inputDescription.html(
      "Arista actual: (" + curr_edge_points[0] + "," + curr_edge_points[1] + ")"
    );
  }
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}

function draw() {
  background(0);
  drawTangents();
  drawCHs();
  drawPAndTurn();
}

function drawTangents() {
  if (tangent_a.size() != 0) {
    tangent_a.drawLinesBetweenPoints(false, "yellow", 3);
  }
  if (tangent_b.size() != 0) {
    tangent_b.drawLinesBetweenPoints(false, "yellow", 3);
  }
}

function drawCHs() {
  convexHull.drawLinesBetweenPoints(true, "green");
  convexHull.drawPoints("blue");
}

function drawPAndTurn() {
  point_to_add.drawPoints("orange");
  curr_edge.drawPoints("red");
  if (arrowColor != null) {
    drawDirectedLine(
      curr_edge.points[0],
      curr_edge.points[1],
      color(256, 12, 23, 180)
    );
    drawArrow(curr_edge.points[1], point_to_add.points[0], arrowColor);
  }
}
