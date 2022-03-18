
function turnDirection(origin,v1,v2){
    crossProduct = (v1.y - origin.y) * (v2.x - origin.x) - (v1.x - origin.x) * (v2.y - origin.y)
    if(crossProduct > 0){
        return 1
    }
    if(crossProduct < 0){
        return -1
    }
    return 0
}
  
function distance(v1,v2){
    return sqrt(pow(v2.x-v1.x,2)+pow(v2.y-v1.y,2))
}