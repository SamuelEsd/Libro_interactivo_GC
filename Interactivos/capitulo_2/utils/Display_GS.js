let points = []
let convexHull = []

let take_step = false
let button

function setup() {
  CUSTOM_WIDTH = windowWidth - 30
  CUSTOM_HEIGHT =  windowHeight - 30
  createCanvas(CUSTOM_WIDTH,CUSTOM_HEIGHT);
  strokeWeight(POINT_SIZE);
  initializeButton();
}

function initializePoints(num_of_points){
  startingP = createVector(WINDOW_BORDER, WINDOW_BORDER)
  endingP = createVector(CUSTOM_WIDTH - WINDOW_BORDER, CUSTOM_HEIGHT - WINDOW_BORDER)
  points = getRandomPointsInArea(num_of_points,startingP,endingP)
}

function initializeButton(){
  button = createButton('Siguiente');
  button.position(CUSTOM_WIDTH - 100, CUSTOM_HEIGHT - 25);
  button.mousePressed(step);
}

function step(){
  print("Step!")
  take_step = true
}

function convexHullJM_steps_1(points){
  // Let's start the hull with the leftmost point
  points = Array.from(points)
  points.sort((a,b) => { return a.x - b.x});
  let hull = [];
  let start = points[0];
  hull.push(start);
  let prevVertex = start;
  while(!take_step){
    print("inside")
    print(take_step)
    background(0);
    drawCH(convexHull);
    drawPoints(points);
  }
  
  while(true){
    let rightmostVertex = null;
    for(let point of points){
      if(point == prevVertex) continue;
      // Take any point diferent to last vertex on hull
      // as rightmost
      if(rightmostVertex == null){
        rightmostVertex = point;
        continue;
      }

      let td = turnDirection(prevVertex, rightmostVertex, point);
      let isColinear = td == 0;
      let isLeftTurn = td == 1;
      let pointIsFarder = distance(prevVertex, rightmostVertex) < distance(prevVertex, point);
      // If there's a point more to the right or colinear but farder
      // that will be our new rightmost
      if ((isColinear && pointIsFarder) || isLeftTurn){
        rightmostVertex = point;
      }
    }
    
    // If we reach the start it's time to finish
    if(rightmostVertex == start) break;
    // It not, add rightmost vertex to hull and take it as the new 
    // vertex to compare with
    hull.push(rightmostVertex);
    prevVertex = rightmostVertex;
  }
  return hull
}

function draw() {
  if(take_step){
    initializePoints(15);
    take_step = false
    convexHull = convexHullJM_steps_1
    
    (points)
  }
  
  background(0);
  drawCH(convexHull);
  drawPoints(points);
}