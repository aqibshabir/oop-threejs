import Experience from '../Experience.ts';
import Environment from './Environment.ts';

export default class World {
  experience: Experience;
  scene;
  environment: Environment;
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;

    this.environment = new Environment();
  }
}
