import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import Circle from './circle';
import { SPEED } from './constants';

new p5(sketch => {

  let textGraphics;
  let text = 'escreva oq quiser';
  let textInput;
  const points = [];
  const circles = [];

  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight - 50);
    textGraphics = sketch.createGraphics(window.innerWidth, window.innerHeight - 50);
    textGraphics.background(0);
    textGraphics.textFont('monospace');
    textGraphics.textAlign(sketch.CENTER);
    textGraphics.fill(255);
    textInput = sketch.createInput();
    textInput.value('escreva oq quiser');
    let delay = -1;
    textInput.input(function() {
      text = this.value();
      clearTimeout(delay);
      delay = setTimeout(() => update(), 250);
    })
    update();
    setTimeout(() => document.querySelector('canvas').focus(), 150);
  };

  sketch.draw = () => {
    sketch.background(255);
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
      let attempts;
      for (let i = 0; i < 10 * SPEED; i++) {
        for (attempts = 0; attempts < 1000; attempts++) {
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
          points.splice(0, points.length);
          console.log('done');
          break;
        }
      }
    }
  };

  const update = () => {
    textGraphics.background(0);
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
    };
  }

});
