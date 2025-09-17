/* eslint-disable react/no-unknown-property */
'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function GlassLens({ scale = 1 }) {
  const meshRef = useRef();
  
  // Create a simple sphere geometry for the lens
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 64, 64);
    geo.scale(1.5, 1.5, 0.3); // Flatten to make it lens-like
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Follow mouse movement smoothly
    const { pointer } = state;
    meshRef.current.position.x = pointer.x * 3;
    meshRef.current.position.y = pointer.y * 3;
    
    // Subtle rotation
    meshRef.current.rotation.x = pointer.y * 0.1;
    meshRef.current.rotation.y = pointer.x * 0.1;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
  });

  return (
    <>
      {/* Background plane to show refraction */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#CF9EFF" opacity={0.1} transparent />
      </mesh>
      
      {/* Glass lens */}
      <mesh ref={meshRef} geometry={geometry} scale={scale}>
        <meshPhysicalMaterial
          transmission={0.95}
          thickness={1}
          roughness={0}
          metalness={0}
          ior={1.5}
          color="#CF9EFF"
          emissive="#CF9EFF"
          emissiveIntensity={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.9}
          reflectivity={0.5}
          envMapIntensity={1}
        />
      </mesh>
    </>
  );
}

export default function FluidGlassSimple({ scale = 1 }) {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'auto', zIndex: 10 }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#CF9EFF" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
        <GlassLens scale={scale} />
      </Canvas>
    </div>
  );
}