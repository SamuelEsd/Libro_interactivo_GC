function getVerticesForDCEL(startingP, endingP) {
  let vertices = [];
  let x_units = Math.floor((endingP.x - startingP.x) / 100);
  let y_units = Math.floor((endingP.y - startingP.y) / 100);
  let i = 0;
  // First graph with arrow shape
  let triangle = [
    [0, 0],
    [10, 25],
    [35, 10],
  ];

  let bigGraph = [
    [80, 5], // 3
    //[60, 15],
    [85, 35],
    //[50, 25],
    [12, 42], // 5
    //[22, 52],
    [5, 87],
    //[70, 107],
    [88, 110],
    //[80, 84],
    //[95, 67],
  ];
  let innerCircle = [
    [25, 57], // 8
    [16, 80],
    [55, 90], // 10
    [78, 50],
  ];

  let raw_vertices = triangle.concat(bigGraph).concat(innerCircle);
  raw_vertices.forEach((element) => {
    vertices.push(
      new Vertex(
        (i++).toString(),
        startingP.x + x_units * element[0],
        startingP.y + y_units * element[1],
        null
      )
    );
  });
  return vertices;
}

function verticesConnections(connections, vertices) {
  let halfEdges = [];

  for (let i = 0; i < connections.length - 1; i++) {
    let origin = vertices[connections[i]].getName();
    let dest = vertices[connections[i + 1]].getName();
    let he1 = new HalfEdge(origin + "to" + dest, origin, dest);
    let he2 = new HalfEdge(dest + "to" + origin, dest, origin);
    he1.setTwin(he2.getName());
    he2.setTwin(he1.getName());
    halfEdges.push(he1);
    halfEdges.push(he2);
  }
  return halfEdges;
}

function setNextAndPrevConnections(connections, halfEdges, face) {
  let lastEdge = null;
  for (let i = 1; i < connections.length - 1; i++) {
    let curr_vert = connections[i];
    let prev_vert = connections[i - 1];
    let next_vert = connections[i + 1];
    let prev = prev_vert.toString() + "to" + curr_vert.toString();
    let curr = curr_vert.toString() + "to" + next_vert.toString();

    console.log(prev, curr);
    halfEdges.get(prev).setNext(curr);
    halfEdges.get(curr).setPrev(prev);
    halfEdges.get(curr).setIncidentFace(face);
  }
}

function getEdgesForDCEL(vertices) {
  let halfEdges = [];
  let triangle_connections = ["0", "2", "1", "0"];
  let bigGraph_connections = ["3", "4", "7", "6", "5", "4"];
  let innnerCircle_connections = ["8", "11", "10", "9", "8"];

  halfEdges = halfEdges.concat(
    verticesConnections(triangle_connections, vertices)
  );
  halfEdges = halfEdges.concat(
    verticesConnections(bigGraph_connections, vertices)
  );
  halfEdges = halfEdges.concat(verticesConnections(["8", "10"], vertices));
  halfEdges = halfEdges.concat(
    verticesConnections(innnerCircle_connections, vertices)
  );
  halfEdges = new Map(
    halfEdges.map((halfEdge) => [halfEdge.getName(), halfEdge])
  );

  let triangle_cw_order = ["0", "2", "1", "0", "2"];
  let triangle_ccw_order = ["0", "1", "2", "0", "1"];
  let bigGraph_cw_order = ["3", "4", "7", "6", "5", "4", "3", "4"];
  let bigGraph_ccw_order = ["4", "5", "6", "7", "4", "5"];
  let innerCircle_cw_order = ["8", "11", "10", "9", "8", "11"];
  let innerCircle_ccw_order_1 = ["8", "9", "10", "8", "9"];
  let innerCircle_ccw_order_2 = ["8", "10", "11", "8", "10"];

  setNextAndPrevConnections(triangle_cw_order, halfEdges, "1");
  setNextAndPrevConnections(triangle_ccw_order, halfEdges, "2");
  setNextAndPrevConnections(bigGraph_cw_order, halfEdges, "1");
  setNextAndPrevConnections(bigGraph_ccw_order, halfEdges, "3");
  setNextAndPrevConnections(innerCircle_cw_order, halfEdges, "3");
  setNextAndPrevConnections(innerCircle_ccw_order_1, halfEdges, "4");
  setNextAndPrevConnections(innerCircle_ccw_order_2, halfEdges, "5");
  console.log(halfEdges);

  return halfEdges;
}
