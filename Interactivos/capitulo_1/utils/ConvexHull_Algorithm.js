function convexHullJM(points){
    // Let's start the hull with the leftmost point
    points.sort((a,b) => { return a.x - b.x});
    let hull = [];
    let start = points[0];
    hull.push(start);
    let prevVertex = start;
    
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