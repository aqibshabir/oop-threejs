import * as THREE from 'three';
import Sizes from './Utils/Sizes.ts';
import Time from './Utils/Time.ts';
import Camera from './Camera.ts';
import Renderer from './Renderer.ts';
import World from './World/World.ts';
import Resources from './Utils/Resources.ts';

export default class Experience {
  static instance: Experience;
  canvas!: HTMLCanvasElement;
  sizes!: Sizes;
  time!: Time;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  resources!: Resources;

  constructor(canvas: HTMLCanvasElement) {
    if (Experience.instance) return Experience.instance;
    Experience.instance = this;

    window.experience = this;
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.sizes.on('resize', () => {
      this.resize();
    });
    this.time.on('tick', () => {
      this.update();
    });
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.camera.update();
    this.renderer.update();
  }
}
