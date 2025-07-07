import * as THREE from 'three';
import Experience from '../Experience.ts';
import type Resources from '../Utils/Resources';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type Time from '../Utils/Time.ts';
import type GUI from 'lil-gui';

interface AnimationProps {
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  play: (name: string) => void;
}

interface DebugProp {
  active: boolean;
  ui?: GUI;
}

export default class Alien {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  resource: GLTF;
  model!: THREE.Object3D;
  animation!: AnimationProps;
  time: Time;
  debug: DebugProp;
  debugFolder?: GUI;
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui?.addFolder('alien');
    }

    this.resource = this.resources.items.alienModel as GLTF;
    this.setModel();
    this.setAnimation();
  }
  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.5, 0.5, 0.5);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {} as AnimationProps;
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {};
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[2]);
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1]);
    this.animation.actions.jog = this.animation.mixer.clipAction(this.resource.animations[0]);

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current as THREE.AnimationAction;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
