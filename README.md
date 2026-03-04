# shapes_connections
### Preview: https://editor.p5js.org/dsshji/full/vbmN4aY4r 
### Concept

Generative art seems very modern and new to me: creating art using your computer and element of randomness sounds like something that has no association with older times.

I wanted to create a minimalistic piece that will carry the atmosphere of the age when a laptop at home was a rare find, and when old Windows 7 and DVD players were considered super cool.

I found my inspiration in Klim Type Foundry art-piece and wanted to recreate something similiar.

I decided to make my art minimalistic and more “mathematical”: I have only two colors, blue and white, strokes and lines, shapes, and a lot of numbers which display the coordinates of the figures.

The computer randomly chooses the type and the coordinates of the figure and draws it, then randomly connecting it with other figures by making it either the endpoint of the bezier curve, or the endpoint of its control line. The figures and lines appear slowly, and move around, displaying their coordinates on top.



### Code
Implementing the animation of line drawing was the most difficult part for me, so I want to highlight it:

```js
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
```

To animate the connections smoothly, I used a normalized time variable, t. Here, t = 0 is the start of the path, and t = 1 is the end. Every frame, value of t of every connection is being incremented by 0.02, revealing 2% more of the path.

For the straight lines I used method lerp(), and for the curves I used bezierPoints(). In the loop coordinates of the current endpoint are slowly increasing from 0 to 1, in the end connecting the first point with the last one, as the coordinates of incremented moving point become the same as the endpoint’s. This creates the illusion of the curve being drawn over time.

Beside that, the structure of the code is pretty simple. I created a class for the figures with methods to create, draw, and move the figures around. After that I connected the figures with lines, and stored all the objects and connections between them in arrays. There’s a lot of randomness in the code: the choice of the velocity of the figure, its shape and which figures it will be connected with lies on the computer, not the user.

### Reflection
I find this minimalistic and simple art piece very hypnotizing and interesting. Even though it’s super simple, I can feel the emotions and atmosphere I wanted it to have.

However, I think that improving connection between figures and making it more smooth and less crunchy would be great. Also, finding an algorithm that would allow these figures to move around without overlapping would make the art less messy.

For further improvement, I think that adding sound effects and gravitating the points and lines in a certain pattern that creates some clear shapes of animals/objects would be extremely cool.
