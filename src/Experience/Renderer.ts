import * as THREE from 'three';
import Experience from './Experience.ts';
import type Camera from './Camera.ts';
import type GUI from 'lil-gui';

interface DebugProp {
  ui: GUI;
}

export default class Renderer {
  experience: Experience;
  canvas: HTMLCanvasElement;
  sizes: { width: number; height: number; pixelRatio: number };
  scene: THREE.Scene;
  camera: Camera;
  instance!: THREE.WebGLRenderer;
  debug: DebugProp;
  debugFolder: GUI;
  clearColor: { color: string };

  constructor() {
    this.experience = Experience.instance!;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.debugFolder = this.debug.ui.addFolder('Sky');
    this.clearColor = { color: '#dba891' };

    this.setInstance();
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setClearColor(0xdba891);
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.debugFolder
      .addColor(this.clearColor, 'color')
      .name('Color')
      .onChange(() => {
        this.instance.setClearColor(this.clearColor.color);
      });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
