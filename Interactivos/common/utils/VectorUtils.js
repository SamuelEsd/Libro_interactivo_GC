/**
 * Draw an arrow for a point A to point B.
 * @param {Vector} origin - Starting point of the
 * arrow.
 * @param {Vector} v1 - Starting point of the
 * arrow.
 * @param {Color} v2 - Color of the arrow.
 */
function turnDirection(origin,v1,v2){
    crossProduct = (v1.y - origin.y) * (v2.x - origin.x) - (v1.x - origin.x) * (v2.y - origin.y)
    if(crossProduct > 0){
        return -1
    }
    if(crossProduct < 0){
        return 1
    }
    return 0
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
function sortCounterClockWise(points,reference_point){
    points.sort(function(p1, p2) {
        if (p1 === reference_point){
            return -1;
        }
        if (p2 === reference_point){
            return 1;
        }

        let is_clock_wise = turnDirection(reference_point,p1,p2);
        
        if (is_clock_wise === 0) {
            if (p1.x === p2.x) {
                return p1.y < p2.y ? -1 : 1;
            }
            else {
                return p1.x < p2.x ? -1 : 1;
            }
        }
        return is_clock_wise
      });
}

/**
 * Calculate the euclid distance of a pair
 * of two dimensional points.
 * @param {Vector} v1 - First point.
 * @param {Vector} v2 - Second point.
 */
function distance(v1,v2){
    return sqrt(pow(v2.x-v1.x,2)+pow(v2.y-v1.y,2))
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
function getRandomPointsInArea(num_of_points,startingP,endingP) {
    points = []
    for(i = 0; i < num_of_points; i++){
      let new_x = Math.ceil(random(startingP.x,endingP.x))
      let new_y = Math.ceil(random(startingP.y,endingP.y))
      points.push( createVector(new_x,new_y,i+1) );
    }
    return points
  }