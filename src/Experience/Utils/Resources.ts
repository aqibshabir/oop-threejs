import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import type { GLTF } from 'three/examples/jsm/Addons.js';
import EventEmitter from './EventEmitter.ts';

interface GltfModelSource {
  name: string;
  type: 'gltfModel';
  path: string;
}

interface TextureSource {
  name: string;
  type: 'texture';
  path: string;
}

interface CubeTextureSource {
  name: string;
  type: 'cubeTexture';
  path: string[];
}

export type SourceProps = GltfModelSource | TextureSource | CubeTextureSource;

interface LoaderProps {
  gltfLoader: GLTFLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;
}

export default class Resources extends EventEmitter {
  sources: SourceProps[];
  items: Record<string, GLTF | THREE.Texture | THREE.CubeTexture>;
  toLoad: number;
  loaded: number;
  isReady: boolean;
  loaders?: LoaderProps;
  loadingSet: Set<string>;

  constructor(sources: SourceProps[]) {
    super();
    this.sources = sources;
    this.items = {};
    this.isReady = false;
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.loadingSet = new Set();
    this.setLoaders();

    if (this.toLoad === 0) {
      this.handleEmptyLoad();
    } else {
      this.startLoading();
    }
  }

  handleEmptyLoad() {
    this.isReady = true;
    setTimeout(() => this.trigger('ready'), 0);
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    };
  }

  startLoading() {
    this.sources.forEach((source) => {
      if (this.loadingSet.has(source.name)) return;
      this.loadingSet.add(source.name);
      this.loadSource(source);
    });
  }

  loadSource(source: SourceProps) {
    switch (source.type) {
      case 'gltfModel':
        this.loadGLTF(source);
        break;
      case 'texture':
        this.loadTexture(source);
        break;
      case 'cubeTexture':
        this.loadCubeTexture(source);
        break;
    }
  }

  loadGLTF(source: GltfModelSource) {
    this.loaders!.gltfLoader.load(source.path, (file) => this.sourceLoaded(source, file));
  }

  loadTexture(source: TextureSource) {
    this.loaders!.textureLoader.load(source.path, (file) => this.sourceLoaded(source, file));
  }

  loadCubeTexture(source: CubeTextureSource) {
    this.loaders!.cubeTextureLoader.load(source.path, (file) => this.sourceLoaded(source, file));
  }

  sourceLoaded(source: SourceProps, file: GLTF | THREE.Texture | THREE.CubeTexture) {
    if (this.items[source.name]) return;
    this.items[source.name] = file;
    this.loaded++;
    this.loadingSet.delete(source.name);

    if (this.loaded === this.toLoad) {
      this.isReady = true;
      this.trigger('ready');
    }
  }
}
