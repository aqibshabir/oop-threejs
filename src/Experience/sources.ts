import type { SourceProps } from './Utils/Resources.ts';

const sources: SourceProps[] = [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
  {
    name: 'grassColorTexture',
    type: 'texture',
    path: 'textures/terrain/color.jpg',
  },
  {
    name: 'grassNormalTexture',
    type: 'texture',
    path: 'textures/terrain/normal.jpg',
  },
  {
    name: 'alienModel',
    type: 'gltfModel',
    path: 'models/Alien/glTF-Binary/alien.glb',
  },
];

export default sources;
