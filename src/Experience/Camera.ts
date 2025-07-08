import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience.ts';

export default class Camera {
  experience: Experience;
  sizes: { width: number; height: number; pixelRatio: number };
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  instance!: THREE.PerspectiveCamera;
  controls!: OrbitControls;

  constructor() {
    this.experience = Experience.instance!;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setControls();
  }
  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
    this.updateCameraSettings();
    this.scene.add(this.instance);
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = Math.PI / 4;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;
    this.controls.target.set(0, 6.5, 0);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.updateCameraSettings();
  }
  update() {
    this.controls.update();
  }
  updateCameraSettings() {
    if (this.sizes.width < 600) {
      this.instance.position.set(14, 14, 60);
      this.instance.fov = 45;
    } else {
      this.instance.position.set(14, 14, 30);
      this.instance.fov = 35;
    }
    this.instance.updateProjectionMatrix();
  }
}
