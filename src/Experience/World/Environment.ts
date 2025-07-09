import * as THREE from 'three';
import Experience from '../Experience.ts';
import Resources from '../Utils/Resources.ts';
import type GUI from 'lil-gui';
import type Renderer from '../Renderer.ts';

interface EnvironmentMapProps {
  intensity: number;
  texture: THREE.Texture | THREE.CubeTexture;
  updateMaterials?: () => void;
}

interface DebugProp {
  ui: GUI;
}

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  sunLight!: THREE.DirectionalLight;
  resources: Resources;
  environmentMap!: EnvironmentMapProps;
  debug: DebugProp;
  debugFolder: GUI;
  renderer: Renderer;
  clearColor = { color: '#dba891' };

  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.debugFolder = this.debug.ui.addFolder('Environment');
    this.debugFolder.close();
    this.renderer = this.experience.renderer;

    this.setSunLight();
    this.setEnvironmentMap();
    this.setSky();
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#fff4f0', 3.5);
    this.sunLight.castShadow = true;
    this.sunLight.position.set(-10, 20, 40);

    this.sunLight.shadow.camera.left = -28;
    this.sunLight.shadow.camera.right = 28;
    this.sunLight.shadow.camera.top = 28;
    this.sunLight.shadow.camera.bottom = -28;

    this.sunLight.shadow.camera.near = 0.1;
    this.sunLight.shadow.camera.far = 100;

    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;

    this.scene.add(this.sunLight);

    this.debugFolder
      .add(this.sunLight, 'intensity')
      .name('Sun Intensity')
      .min(0)
      .max(10)
      .step(0.001);

    this.debugFolder
      .add(this.sunLight.position, 'x')
      .name('Sun x-axis')
      .min(-40)
      .max(40)
      .step(0.001);

    this.debugFolder
      .add(this.sunLight.position, 'y')
      .name('Sun y-axis')
      .min(20)
      .max(40)
      .step(0.001);

    this.debugFolder
      .add(this.sunLight.position, 'z')
      .name('Sun z-axis')
      .min(10)
      .max(40)
      .step(0.001);
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
    this.debugFolder
      .add(this.environmentMap, 'intensity')
      .name('Environment Intensity')
      .min(-2)
      .max(2)
      .step(0.001)
      .onChange(this.environmentMap.updateMaterials);
    this.environmentMap.updateMaterials();
  }
  setSky() {
    this.debugFolder
      .addColor(this.clearColor, 'color')
      .name('Sky Color')
      .onChange(() => {
        this.renderer.instance.setClearColor(this.clearColor.color);
      });
  }
}
