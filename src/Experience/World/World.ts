import * as THREE from 'three';
import Experience from '../Experience.ts';
import Environment from './Environment.ts';
import Resources from '../Utils/Resources.ts';
import Floor from './Floor.ts';
import Alien from './Alien.ts';
import Rock from './Rock.ts';

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  environment?: Environment;
  floor?: Floor;
  alien?: Alien;
  rocks?: Rock[];
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.floor = new Floor();
      this.alien = new Alien();
      this.rocks = [
        new Rock(new THREE.Vector3(4, 10, -24), 10, 2),
        new Rock(new THREE.Vector3(14, 0, -12), 4, 0),
        new Rock(new THREE.Vector3(0, 0, 20), 5, 0),
        new Rock(new THREE.Vector3(-20, 0, -10), 8, 0),
      ];
      this.environment = new Environment();
    });

    this.update();
  }
  update() {
    if (this.alien) {
      this.alien.update();
    }
  }
}
