let convexHull = []
let points = []

function setup() {
    createCanvas(windowWidth, windowHeight);
    initializePoints(15);
}

function initializePoints(num_of_points) {
  for(i = 0; i < num_of_points; i++){
    points.push(createVector(Math.ceil(random(windowWidth)),Math.ceil(random(windowHeight))));
  }
}

function drawPoints(points){
  pointRadius = 20
  strokeWeight(pointRadius);
  for(i = 0; i < points.length; i++){
    mouseVector = createVector(mouseX,mouseY)
    if (mouseIsPressed == true && mouseButton == LEFT && distance(points[i],mouseVector) < pointRadius/2) {
      stroke('red');
      points[i].x = mouseX;
      points[i].y = mouseY;
    }
    else {
      if(i == 0){
        stroke('purple');
      }
      else{
        stroke(256);
      }
    }
    point(points[i].x, points[i].y);
  }
}

function drawLines(points){
  let size = points.length
  strokeWeight(5);
  stroke('green');
  for(i = 0; i < points.length; i++){
    line(points[i].x, points[i].y,points[(i+1)%size].x, points[(i+1)%size].y);
  }
}

function draw() {
  convexHull = convexHullJM(points)
  background(0);
  drawLines(convexHull)
  drawPoints(points);
}