let points = []
let selectedPoint = -1

function setup() {
  CUSTOM_WIDTH = windowWidth - 30;
  CUSTOM_HEIGHT = windowHeight - 30;
  
  createCanvas(CUSTOM_WIDTH, CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializePoints(15);
}

function initializePoints(num_of_points) {
  startingP = createVector(WINDOW_BORDER, WINDOW_BORDER);
  endingP = createVector(
    CUSTOM_WIDTH - WINDOW_BORDER,
    CUSTOM_HEIGHT - WINDOW_BORDER
  );
  points = getRandomPointsInArea(num_of_points, startingP, endingP);
}

function touchMoved() {
  for(i = 0; i < points.length; i++){
    mouseVector = createVector(mouseX,mouseY)
    if (mouseIsPressed == true) {
      if(selectedPoint == -1) {
        if(mouseButton == LEFT && distance(points[i],mouseVector) < POINT_SIZE/2){
          selectedPoint = i
          return
        }
      }
    }
  }
}

function touchEnded() {
  selectedPoint = -1
}

function draw() {
  let convexHull = convexHullJM(points)
  background(0);
  drawLines(convexHull,'green');
  drawPointsWithSelection(points, selectedPoint)
}