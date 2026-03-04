let shapes = ['circle', 'triangle', 'square'];
let all_objects = [];
let size = 30; //set the buffer that will set the boundary for the figure so they don't overlap
//generate some arrays that will hold the later created objects
let anchors = [];
let points = [];
let connections = [];

//create Shape class that will create, move, and draw the figures
class Shape {
  constructor(x, y) {
    this.shape = random(shapes);
    //set fixed values for figures size so they look the same
    this.x = x;
    this.y = y;
    this.d = 15;
    this.s = 15;
    this.r = 15;
    //choose the acceleration value randomly (include negatives so it can move all directions)
    this.vx = random(-2,2);
    this.vy = random(-2,2);
  }
  
  //introduce a method that will check for overlapping
  overlapping() {
    for (let other of all_objects) {
      let d = dist(this.x, this.y, other.x, other.y);
      if (d < size) return true; //return true if the distance between the center of current figure and other figures that are already created is less than set buffer of 30px
    }
    return false;
  }
  
  //introduce a method that will move the figures around
  move() {
      //each time the method is called, x and y variable are moved by some random velocity that was generated in the constructor of the object
      this.x += this.vx;
      this.y += this.vy;
      //if the figure hit the wall, inverse the direction
      if (this.x-size < 0 || this.x+size > width) this.vx *= -1;
      if (this.y-size < 0 || this.y+size > height) this.vy *= -1;
  }
  
  //introduce the method for drawinf the figures
  draw_shape() {
    stroke(255);
    strokeWeight(1);
    noFill();
    this.move(); //move before drawing
    
    //draw the figure with x,y being the center of the figure
    if (this.shape === 'circle') {
      circle(this.x, this.y, this.d);
    } else if (this.shape === 'triangle') {
      let h = this.r*sqrt(3)/2
      triangle(this.x, this.y - h*2/3, this.x + 0.5 * this.r, this.y + h/3, this.x - 0.5 * this.r, this.y + h/3);
    } else {
      square(this.x, this.y, this.s);
    }
    
    strokeWeight(2);
    point(this.x,this.y); //draw the point in the center of the figure
    fill(255);
    noStroke();
    textSize(10);
    textAlign(CENTER);
    let coords = `(${round(this.x)}, ${round(this.y)})`; //f-string of rounded coordinates of the figure
    text(coords, this.x, this.y - 15); //display the coordinates on top of the figure 
  }
}



function setup() {
  createCanvas(400, 400);
  frameRate(30);
  
  //set CENTER as mode so it's easier to create figures with inside dots and text aligned exactly at the center
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
}

function draw() {
  background('rgb(0,46,255)');

  //add new shapes every 30 frames until we have 16 of them
  if (frameCount % 30 === 0 && all_objects.length < 16) {
    let candidate = new Shape(random(size, width - size), random(size, height - size)); //boundary of the figure so it doesn't generate off-border
    
    if (!candidate.overlapping()) {
      all_objects.push(candidate); //add to the array if no overlapping found
      
      //update the slices: random 10 objects are on the anchors and other 10 are on the control lines
      let half = floor(all_objects.length / 2);
      points = all_objects.slice(0, half);
      anchors = all_objects.slice(half);
      
      let connIndex = 0; //track which connection is about to be updated
      
      for (let c = 0; c < points.length - 1; c += 2) {
        if (anchors[c+1]) { 
           
           //check if current figure is in the connection with other one already
           if (connections[connIndex]) {
             //change the shape it points to but do not reset the progress of drawing the bezier
             connections[connIndex].a0 = anchors[c];
             connections[connIndex].p0 = points[c];
             connections[connIndex].p1 = points[c+1];
             connections[connIndex].a1 = anchors[c+1];
           } else {
             //else create a new one with progress of drawinf t being set to 0
             connections.push({
               a0: anchors[c], 
               p0: points[c], 
               p1: points[c+1], 
               a1: anchors[c+1], 
               t: 0
             });
           }
           connIndex++; //increment the index
        }
      }
    }
  }

  //draw connections between objects
  for (let c of connections) {
    // animate t from 0 to 1 
    // existing lines stay at 1 (fully drawn)
    c.t = min(c.t + 0.02, 1); 

    noFill();
    stroke(255);
    strokeWeight(1);

    beginShape();
    // draw the curve based on the current value of t
    //the loop will increment t, therefore moving (x,y) to the second enpoint, allowing a smooth animation
    for (let t = 0; t <= c.t; t += 0.02) {
      let x = bezierPoint(c.a0.x, c.p0.x, c.p1.x, c.a1.x, t); 
      let y = bezierPoint(c.a0.y, c.p0.y, c.p1.y, c.a1.y, t); //save coordinates of a segment of the curve being drawn
      vertex(x, y); //add x,y up to which the curve will be drawn
    }
    endShape();
    
    //do the same for the control lines: it also will be drawn slowly based on t
    let h1x = lerp(c.a0.x, c.p0.x, c.t);
    let h1y = lerp(c.a0.y, c.p0.y, c.t);
    line(c.a0.x, c.a0.y, h1x, h1y);

    let h2x = lerp(c.a1.x, c.p1.x, c.t);
    let h2y = lerp(c.a1.y, c.p1.y, c.t);
    line(c.a1.x, c.a1.y, h2x, h2y);
  }
  
  //draw shapes
  for (let obj of all_objects) {
    obj.draw_shape();
}
}


