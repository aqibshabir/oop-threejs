import * as THREE from 'three';
import Experience from '../Experience.ts';
import type Resources from '../Utils/Resources';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Alien {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  resource: GLTF;
  model!: THREE.Object3D;
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resource = this.resources.items.alienModel as GLTF;
    this.setModel();
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.09, 0.09, 0.09);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}
