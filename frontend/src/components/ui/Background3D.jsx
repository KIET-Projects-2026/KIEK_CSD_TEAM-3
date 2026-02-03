import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import ErrorBoundary from '../common/ErrorBoundary';

function FloatingParticle({ position, color = "#4F46E5", scale = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.3} 
            roughness={0.2}
            metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function FloatingCube({ position, color, scale }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.005;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                 <boxGeometry args={[1, 1, 1]} />
                 <meshStandardMaterial color={color} transparent opacity={0.15} wireframe />
            </mesh>
        </Float>
    )
}

const BackgroundScene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <group>
                <FloatingParticle position={[-4, 2, -5]} color="#4F46E5" scale={1.5} />
                <FloatingParticle position={[4, -2, -5]} color="#22D3EE" scale={2} />
                <FloatingParticle position={[0, 4, -8]} color="#3B82F6" scale={1} />
                
                <FloatingCube position={[-6, -3, -4]} color="#4F46E5" scale={1} />
                <FloatingCube position={[6, 3, -4]} color="#22D3EE" scale={0.8} />
            </group>
        </>
    )
}

const Background3D = () => {
  // Safe failover for WebGL context loss or mobile crashes
  return (
    <div className="fixed inset-0 -z-10 bg-surface-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 pointer-events-none" />
        
        <ErrorBoundary fallback={null}>
            <Canvas 
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 2]} // Clamp pixel ratio for mobile performance
                gl={{ antialias: true, alpha: true, powerPreference: "default" }}
                resize={{ scroll: false, debounce: 50 }}
            >
                <BackgroundScene />
            </Canvas>
        </ErrorBoundary>
    </div>
  );
};

export default Background3D;

