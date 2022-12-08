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
    [60, 15],
    [85, 35], // 5
    [50, 25],
    [12, 42],
    [22, 52],
    [5, 87],
    [70, 107], // 10
    [88, 110],
    [80, 84],
    [95, 67],
  ];
  let innerCircle = [
    [25, 57], // 14
    [16, 80], // 15
    [55, 90],
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
    halfEdges.push(new HalfEdge(origin + "to" + dest, origin, dest));
    halfEdges.push(new HalfEdge(dest + "to" + origin, dest, origin));
  }
  console.log(halfEdges);
  return halfEdges;
}

function getEdgesForDCEL(vertices) {
  let halfEdges = [];
  let triangle_connections = ["0", "1", "2", "0"];
  let bigGraph_connections = [
    "3",
    "4",
    "5",
    "6",
    "8",
    "7",
    "9",
    "10",
    "11",
    "12",
    "13",
    "5",
  ];
  let innnerCircle_connections = ["14", "15", "16", "17", "14"];

  halfEdges = halfEdges.concat(
    verticesConnections(triangle_connections, vertices)
  );
  halfEdges = halfEdges.concat(
    verticesConnections(bigGraph_connections, vertices)
  );
  halfEdges = halfEdges.concat(verticesConnections(["6", "7"], vertices));
  halfEdges = halfEdges.concat(verticesConnections(["10", "12"], vertices));
  halfEdges = halfEdges.concat(verticesConnections(["11", "13"], vertices));
  halfEdges = halfEdges.concat(
    verticesConnections(innnerCircle_connections, vertices)
  );
  return halfEdges;
}
