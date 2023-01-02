function getVerticesForDCEL_hole(startingP, endingP) {
  let vertices = [];
  let x_units = Math.floor((endingP.x - startingP.x) / 100);
  let y_units = Math.floor((endingP.y - startingP.y) / 100);
  let i = 0;
  let innerCircle = [
    [25, 57], // 8
    [16, 80],
    [55, 90], // 10
    [78, 50],
  ];

  let raw_vertices = innerCircle;
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

function getEdgesForDCEL_hole(vertices) {
  console.log(vertices);
  let halfEdges = [];
  let innnerCircle_connections = ["0", "3", "2", "1", "0"];

  halfEdges = halfEdges.concat(verticesConnections(["0", "2"], vertices));
  halfEdges = halfEdges.concat(
    verticesConnections(innnerCircle_connections, vertices)
  );
  halfEdges = new Map(
    halfEdges.map((halfEdge) => [halfEdge.getName(), halfEdge])
  );

  let innerCircle_cw_order = ["0", "3", "2", "1", "0", "3"];
  let innerCircle_ccw_order_1 = ["0", "1", "2", "0", "1"];
  let innerCircle_ccw_order_2 = ["0", "2", "3", "0", "2"];
  console.log(halfEdges);

  setNextAndPrevConnections(innerCircle_cw_order, halfEdges, "0");
  setNextAndPrevConnections(innerCircle_ccw_order_1, halfEdges, "1");
  setNextAndPrevConnections(innerCircle_ccw_order_2, halfEdges, "2");
  console.log(halfEdges);
  console.log("HELO");

  return halfEdges;
}
