import * as THREE from 'three';
import Experience from '../Experience.ts';
import type Resources from '../Utils/Resources.ts';

interface TextureProps {
  color: THREE.Texture;
  normal: THREE.Texture;
}

export default class Floor {
  experience: Experience;
  scene: THREE.Scene;
  resources: Resources;
  geometry!: THREE.CircleGeometry;
  textures!: TextureProps;
  material!: THREE.MeshStandardMaterial;
  mesh!: THREE.Mesh;
  constructor() {
    this.experience = Experience.instance!;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }
  setGeometry() {
    this.geometry = new THREE.CircleGeometry(20, 64);
  }
  setTextures() {
    this.textures = {} as TextureProps;
    // color
    this.textures.color = this.resources.items.grassColorTexture as THREE.Texture;
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;
    // normal
    this.textures.normal = this.resources.items.grassNormalTexture as THREE.Texture;

    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
