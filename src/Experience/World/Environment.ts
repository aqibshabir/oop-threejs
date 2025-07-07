import * as THREE from 'three';
import Experience from '../Experience.ts';
import Resources from '../Utils/Resources.ts';

interface EnvironmentMapProps {
  intensity: number;
  texture: THREE.Texture | THREE.CubeTexture;
  updateMaterials?: () => void;
}

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  sunLight!: THREE.DirectionalLight;
  resources: Resources;
  environmentMap!: EnvironmentMapProps;

  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setSunLight();
    this.setEnvironmentMap();
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.left = -20;
    this.sunLight.shadow.camera.right = 20;
    this.sunLight.shadow.camera.top = 20;
    this.sunLight.shadow.camera.bottom = -20;
    this.sunLight.shadow.camera.near = -2;
    this.sunLight.shadow.camera.far = 30;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(6, 8, 4);
    this.scene.add(this.sunLight);
  }
  setEnvironmentMap() {
    this.environmentMap = {} as EnvironmentMapProps;
    this.environmentMap.intensity = 0.4;

    this.environmentMap.texture = this.resources.items.environmentMapTexture as
      | THREE.Texture
      | THREE.CubeTexture;
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();
  }
}
