import EventEmitter from './EventEmitter.ts';
export default class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    window.requestAnimationFrame(() => {
      this.tick(); // waits one frame before setting this.tick() - very specific bug that it fixes
    });
  }
  tick() {
    window.requestAnimationFrame(() => {
      const currentTime: number = Date.now();
      this.delta = currentTime - this.current;
      this.current = currentTime;
      this.elapsed = currentTime - this.start;
      this.trigger('tick');
      window.requestAnimationFrame(() => {
        this.tick();
      });
    });
  }
}
