import * as THREE from 'three';
import Experience from '../Experience.ts';
import Environment from './Environment.ts';
import Resources from '../Utils/Resources.ts';
import Floor from './Floor.ts';
import Alien from './Alien.ts';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  environment?: Environment;
  floor?: Floor;
  alien?: Alien;
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.floor = new Floor();
      this.alien = new Alien();
      this.environment = new Environment();
    });
  }
}
