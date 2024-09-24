// Model.tsx
import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
  };
  materials: {};
};

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF('/model.glb') as GLTFResult;

  // Mevcut materyali wireframe olarak ayarlıyoruz
  const originalMaterial = nodes.mesh_0.material as THREE.MeshBasicMaterial; // Tür dönüşümü

  // Wireframe materyalini uyguluyoruz
  originalMaterial.wireframe = true; // Wireframe efekti

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={originalMaterial}
      />
    </group>
  );
}

useGLTF.preload('/model.glb');
