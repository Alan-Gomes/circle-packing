import p5 from 'p5';
import Circle from './circle';
import { SPEED } from './constants';

new p5(sketch => {

  let textGraphics;
  let text = '';
  const points = [];
  const circles = [];

  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);
    textGraphics = sketch.createGraphics(window.innerWidth, window.innerHeight);
    textGraphics.background(0);
    textGraphics.textFont('monospace');
    textGraphics.textAlign(sketch.CENTER);
    textGraphics.fill(255);
  };

  sketch.draw = () => {
    sketch.background(255);
    sketch.textFont('monospace');
    sketch.stroke(255);
    sketch.fill(0);
    sketch.textSize(20);
    sketch.text(text, 5, 25);
    sketch.text('Pressione ESC para limpar', 5, sketch.height - 10);
    circles.forEach(circle => {
      if (circle.isGrowing) {
        circle.isGrowing =
          !circle.isTouchingBorders(textGraphics.width, textGraphics.height)
          && !circles.some(c => circle.isTouchingCircle(c, sketch.dist));
        circle.grow();
      }
      circle.show(sketch);
    });
    if (points.length > 0 && sketch.frameCount % Math.ceil(5 * (1 / SPEED)) == 0) {
      let attempts, fails = 0;
      for (let i = 0; i < 10 * SPEED; i++) {
        for (attempts = 0; attempts < 100; attempts++) {
          const pos = points[Math.floor(sketch.random(0, points.length))];
          if (!circles.some(c => c.isInside(pos, sketch.dist))) {
            circles.push(new Circle(
              pos.x,
              pos.y,
              1,
              sketch.color(
                sketch.random(0, 205),
                sketch.random(0, 205),
                sketch.random(0, 205)
              ),
              textGraphics.textSize() * 0.02
            ));
            break;
          }
        }
        if (attempts === 1000) {
          fails++;
        }
      }
      if (fails === 10) {
        points.splice(0, points.length);
        console.log("done");
      }
    }
  };

  sketch.keyTyped = () => {
    const { key } = sketch;
    if ((key < 'a' || key > 'z') && (key < '0' || key > '9') && key !== ' ') return;
    textGraphics.background(0);
    text += key;
    textGraphics.textSize((textGraphics.width / text.length) * 1.5);
    textGraphics.text(text, textGraphics.width / 2, textGraphics.height / 2 + (textGraphics.textSize() * 0.2));
    points.splice(0, points.length);
    circles.splice(0, circles.length);
    textGraphics.loadPixels();
    const d = textGraphics.pixelDensity();
    for (let x = 0; x < textGraphics.width; x++) {
      for (let y = 0; y < textGraphics.height; y++) {
        const index = 4 * ((y * d) * textGraphics.width * d + (x * d));
        const rgb = [
          textGraphics.pixels[index],
          textGraphics.pixels[index + 1],
          textGraphics.pixels[index + 2]
        ];
        if (rgb[0] > 0 || rgb[1] > 0 || rgb[2] > 0) {
          points.push({ x, y });
        }
      }
    }
  };

  sketch.keyPressed = () => {
    if (sketch.keyCode === 27) {
      text = '';
      points.splice(0, points.length);
      circles.splice(0, circles.length);
    }
  }

});
