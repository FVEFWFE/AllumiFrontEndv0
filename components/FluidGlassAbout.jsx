/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, Suspense, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  MeshTransmissionMaterial,
} from '@react-three/drei';
import { easing } from 'maath';

export default function FluidGlassAbout({ 
  scale = 0.25,
  ior = 1.15,
  thickness = 5,
  chromaticAberration = 0.1,
  anisotropy = 0.01,
  position = [0, 0, 0]
}) {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Lens 
            scale={scale}
            ior={ior}
            thickness={thickness}
            chromaticAberration={chromaticAberration}
            anisotropy={anisotropy}
            position={position}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

const Lens = memo(function Lens({ scale, ior, thickness, chromaticAberration, anisotropy, position }) {
  const ref = useRef();
  const buffer = useFBO();
  const [scene] = useState(() => new THREE.Scene());
  
  // Create lens geometry procedurally instead of loading from file
  const lensGeometry = useMemo(() => {
    // Create a sphere that acts as a lens
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    // Flatten it a bit to make it more lens-like
    geometry.scale(1, 1, 0.3);
    return geometry;
  }, []);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    
    // Follow pointer smoothly
    const destX = (pointer.x * v.width) / 4;
    const destY = (pointer.y * v.height) / 4;
    
    if (ref.current) {
      easing.damp3(ref.current.position, [destX + position[0], destY + position[1], 15], 0.15, delta);
      
      // Subtle rotation based on pointer
      ref.current.rotation.z = pointer.x * 0.1;
      ref.current.rotation.x = Math.PI / 2 + pointer.y * 0.1;
    }

    gl.setRenderTarget(buffer);
    gl.setClearColor(0x000000, 0);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <mesh>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>,
        scene
      )}
      <mesh 
        ref={ref} 
        scale={scale} 
        geometry={lensGeometry}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior}
          thickness={thickness}
          anisotropy={anisotropy}
          chromaticAberration={chromaticAberration}
          transmission={1}
          roughness={0}
          color="#CF9EFF"
          attenuationColor="#CF9EFF"
          attenuationDistance={0.5}
        />
      </mesh>
    </>
  );
});