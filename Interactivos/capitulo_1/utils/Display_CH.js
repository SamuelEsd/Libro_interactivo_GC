let points = []
let selectedPoint = -1
let pointRadius = 20
let lineSize = 5
let mouseSize = 20
let customWidth = 0
let customHeight = 0

function setup() {
    customWidth = windowWidth - 30
    customHeight = windowHeight - 30
    createCanvas(customWidth,customHeight);
    strokeWeight(pointRadius);
    initializePoints(15);
}

function initializePoints(num_of_points) {
  for(i = 0; i < num_of_points; i++){
    points.push(createVector(Math.ceil(random(customWidth)),Math.ceil(random(customHeight))));
  }
}

function drawPoints(){
  strokeWeight(mouseSize);
  for(i = 0; i < points.length; i++){
    if (selectedPoint == i) {
      stroke('red');
      points[i].x = mouseX;
      points[i].y = mouseY;
    }
    else {
      stroke(256);
    }
    point(points[i].x, points[i].y);
  }
}

function mousePressed() {
  for(i = 0; i < points.length; i++){
    mouseVector = createVector(mouseX,mouseY)
    if (mouseIsPressed == true) {
      if(selectedPoint == -1) {
        if(mouseButton == LEFT && distance(points[i],mouseVector) < pointRadius/2){
          selectedPoint = i
          return
        }
      }
      else{
        selectedPoint = -1
        return
      }
    }
  }
}

function drawLines(points){
  let size = points.length
  strokeWeight(lineSize);
  stroke('green');
  for(i = 0; i < points.length; i++){
    line(points[i].x, points[i].y,points[(i+1)%size].x, points[(i+1)%size].y);
  }
}

function draw() {
  let convexHull = convexHullJM(points)
  background(0);
  drawLines(convexHull);
  drawPoints(points);
}