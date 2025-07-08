import * as THREE from 'three';
import Experience from '../Experience.ts';
import type Resources from '../Utils/Resources';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Rock {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  resource: GLTF;
  model!: THREE.Object3D;

  constructor(
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    scale: number = 0.5,
    rotate: number
  ) {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items['rockModel'] as GLTF;

    this.setModel(position, scale, rotate);
  }
  setModel(position: THREE.Vector3, scale: number, rotate: number) {
    this.model = this.resource.scene.clone(true);
    this.model.scale.setScalar(scale);
    this.model.position.copy(position);
    this.model.rotation.x = rotate;
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }
}
