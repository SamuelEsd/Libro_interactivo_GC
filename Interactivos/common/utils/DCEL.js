class DCEL {
  constructor(vertices = [], halfEdges = [], faces = []) {
    console.log(vertices);
    this.vertices = new Map(
      vertices.map((vertex) => [vertex.getName(), vertex])
    );
    console.log(halfEdges);
    this.halfEdges = new Map(
      halfEdges.map((halfEdge) => [halfEdge.getName(), halfEdge])
    );
    console.log(this.halfEdges);
    this.faces = new Map(faces.map((face) => [face.getName(), face]));
  }

  /**
   * Draws all the PointSet points on the screen,
   * with a line of an specific color, surrounding the points.
   * If the coordinate z is greater than 0, it will be considered
   * as the ID i of the point, and it will be displayed on the
   * center of the point as Pi.
   * @param {Color} color - Color of the points to be drawn.
   */
  drawPoints(color, point_size = POINT_SIZE) {
    noStroke();
    this.vertices.forEach((vertex, vertexName) => {
      push();
      fill(255);
      stroke(color);
      strokeWeight(3);
      circle(vertex.getX(), vertex.getY(), point_size);
      if (vertex.getName() != null) {
        push();
        textSize(POINT_SIZE / 2);
        textAlign(CENTER);
        text(
          "P" + vertex.getName(),
          vertex.getX(),
          vertex.getY() + POINT_SIZE / 4
        );
        pop();
      }
      pop();
    });
  }

  /**
   * Draws all the PointSet points on the screen,
   * with a line of an specific color, surrounding the points.
   * If the coordinate z is greater than 0, it will be considered
   * as the ID i of the point, and it will be displayed on the
   * center of the point as Pi.
   * @param {Color} color - Color of the points to be drawn.
   */
  drawHalfEdges(color, point_size = POINT_SIZE) {
    noStroke();
    console.log(this.vertices);
    this.halfEdges.forEach((halfEdge, halfEdgeName) => {
      console.log(halfEdge);
      let origin = this.vertices.get(halfEdge.getOrigin());
      console.log(origin);
      let dest = this.vertices.get(halfEdge.getDestination());
      let o = createVector(origin.getX(), origin.getY());
      let d = createVector(dest.getX(), dest.getY());
      console.log(o);
      console.log(d);
      drawArrowToRight(o, d, "white", 3);
    });
  }
}
/**
 * Class to represent a vertex on a DCEL
 *
 * @class Vertex
 */
class Vertex {
  constructor(name, x, y, incidentEdge = null) {
    this.vertexName = name;
    this.x = x;
    this.y = y;
    this.incidentEdge = incidentEdge;
  }

  /**
   * Returns the name of the vertex.
   * @return {string} the name of the vertex.
   */
  getName() {
    return this.vertexName;
  }
  /**
   * Returns the x value of the vertex.
   * @return {number} the x value of the vertex.
   */
  getX() {
    return this.x;
  }
  /**
   * Returns the y value of the vertex.
   * @return {number} the y value of the vertex.
   */
  getY() {
    return this.y;
  }
}

class HalfEdge {
  constructor(edgeName, origin, destination) {
    this.edgeName = edgeName;
    this.origin = origin;
    this.destination = destination;
    this.incidentFace = null;
    this.twin = null;
    this.next = null;
    this.prev = null;
  }

  setIncidentFace(incidentFace) {
    this.incidentFace = incidentFace;
  }

  setTwin(twin) {
    this.twin = twin;
  }

  setNext(next) {
    this.next = next;
  }

  setPrev(prev) {
    this.prev = prev;
  }
  /**
   * Returns the name of the halfEdge.
   * @return {string} the name of the halfEdge.
   */
  getName() {
    return this.edgeName;
  }

  getOrigin() {
    return this.origin;
  }

  getDestination() {
    return this.destination;
  }
}

class Face {
  constructor() {
    this.faceName = null;
    this.outerComponent = null;
    this.innerComponents = [];
  }
  /**
   * Returns the name of the face.
   * @return {string} the name of the face.
   */
  getName() {
    return this.faceName;
  }
}
