import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience.ts';
import type GUI from 'lil-gui';

type CameraPreset = 'default' | 'birds-eye' | 'close-up' | 'far';

interface DebugProp {
  ui: GUI;
}

export default class Camera {
  experience: Experience;
  sizes: { width: number; height: number; pixelRatio: number };
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  instance!: THREE.PerspectiveCamera;
  controls!: OrbitControls;
  debug: DebugProp;
  debugFolder: GUI;

  constructor() {
    this.experience = Experience.instance!;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.debugFolder = this.debug.ui.addFolder('Camera');
    this.debugFolder.close();
    const debugObject = {
      default: () => this.setCameraAngle('default'),
      birdsEye: () => this.setCameraAngle('birds-eye'),
      closeUp: () => this.setCameraAngle('close-up'),
      far: () => this.setCameraAngle('far'),
    };

    this.debugFolder.add(debugObject, 'default').name('Default View');
    this.debugFolder.add(debugObject, 'birdsEye').name('Birds-Eye View');
    this.debugFolder.add(debugObject, 'closeUp').name('Close-Up View');
    this.debugFolder.add(debugObject, 'far').name('Far View');

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
      this.instance.position.set(6, 3, 36);
      this.instance.fov = 55;
    } else {
      this.instance.position.set(6, 3, 36);
      this.instance.fov = 35;
    }
    this.instance.updateProjectionMatrix();
  }
  setCameraAngle(preset: CameraPreset) {
    switch (preset) {
      case 'default':
        this.instance.position.set(6, 3, 36);
        this.controls.target.set(0, 6.5, 0);
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.instance.fov = this.sizes.width < 600 ? 55 : 35;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        break;

      case 'birds-eye':
        this.instance.position.set(10, 50, -50);
        this.controls.target.set(0, 0, 0);
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 3;
        this.instance.fov = this.sizes.width < 600 ? 70 : 60;
        break;

      case 'close-up':
        this.experience.world?.alien?.animation.actions.current.stop();
        this.experience.world?.alien?.animation.play('idle');
        this.instance.position.set(0, 5, 0);
        this.controls.target.set(0, 6.7, 0);
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.instance.fov = this.sizes.width < 600 ? 20 : 8;

        break;

      case 'far':
        this.instance.position.set(100, 20, -50);
        this.controls.target.set(0, 14, 0);
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.instance.fov = this.sizes.width < 600 ? 90 : 70;
        break;
    }

    this.instance.updateProjectionMatrix();
    this.controls.update();
  }
}
