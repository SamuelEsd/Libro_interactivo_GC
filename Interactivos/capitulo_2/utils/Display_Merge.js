let left_pointsSet = [];
let right_pointsSet = [];

let left_convexHull = [];
let right_convexHull = [];

let half_point = null
let touched = false
let selectedPoint = -1

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;
  half_point = Math.ceil((CUSTOM_WIDTH)/2)

  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializePoints(10);
}

function initializePoints(num_of_points) {
  startingP_left = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP_left = createVector(
    half_point-20,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  startingP_right = createVector(half_point+20, WINDOW_BORDER);
  endingP_right = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  left_pointsSet = getRandomPointsInArea(Math.floor(num_of_points/2), startingP_left, endingP_left);
  right_pointsSet = getRandomPointsInArea(Math.ceil(num_of_points/2), startingP_right, endingP_right);
}

function addIds(points){
  for (i = 0; i < points.length; i++) {
    points[i].z = i+1
  }

}

function drawCHs(){
  drawLines(left_convexHull,'green');
  drawLines(right_convexHull,'green');

  drawPoints(left_pointsSet, "blue");
  drawPoints(right_pointsSet, "blue");
}

function drawMiddleLine(){
  push();
  stroke('red');
  strokeWeight(3);
  line(half_point, WINDOW_BORDER, half_point, CUSTOM_HEIGHT - WINDOW_BORDER);
  pop();
}

function drawLinesOfTwoCH(){

}

function draw() {  
  left_convexHull = convexHullJM(left_pointsSet);
  addIds(left_convexHull);
  right_convexHull = convexHullJM(right_pointsSet);
  addIds(right_convexHull);

  background(0);

  drawCHs();
  drawMiddleLine();

}