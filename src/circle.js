import p5 from 'p5';
import { SPEED } from './constants';

module.exports = class Circle {

  constructor(x, y, r, color, maxSize) {
    this.pos = new p5.Vector(x, y);
    this.r = r;
    this.isGrowing = true;
    this.color = color;
    this.maxSize = maxSize;
  }

  show(graphics) {
    // graphics.noFill();
    graphics.stroke(this.color);
    graphics.fill(this.color);
    graphics.strokeWeight(2);
    graphics.ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  grow() {
    if (this.isGrowing && this.r < this.maxSize) {
      this.r += .7 * SPEED;
    }
  }

  isTouchingBorders(width, height) {
    const { x, y } = this.pos;
    return x + this.r >= width || x - this.r <= 0 || y + this.r >= height || y - this.r <= 0;
  }

  isTouchingCircle(circle, dist) {
    return circle !== this && dist(circle.pos.x, circle.pos.y, this.pos.x, this.pos.y) < (this.r + circle.r + 2);
  }

  isInside(pos, dist) {
    return (dist(pos.x, pos.y, this.pos.x, this.pos.y) - 2) < this.r;
  }

}
