import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

interface MannequinProps {
  height?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  gender?: "nam" | "nu";
}

// Female Mannequin - Softer curves, narrower shoulders, defined waist
function FemaleMannequin({ height = 165, bust = 82, waist = 65, hip = 93 }: MannequinProps) {
  const heightScale = height / 165;
  const bustScale = bust / 82;
  const waistScale = waist / 65;
  const hipScale = hip / 93;

  return (
    <group position={[0, -1.65, 0]} scale={heightScale}>
      {/* Head - slightly smaller and rounder */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Neck - slender */}
      <mesh position={[0, 2.75, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.095, 0.28, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Shoulders - narrower and rounded */}
      <mesh position={[0, 2.52, 0]} castShadow scale={[bustScale * 0.95, 0.8, bustScale * 0.6]}>
        <capsuleGeometry args={[0.32, 0.22, 24, 48]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Upper Chest - bust area */}
      <mesh position={[0, 2.15, 0.02]} castShadow scale={[bustScale * 1.0, 1, bustScale * 0.85]}>
        <capsuleGeometry args={[0.32, 0.45, 24, 48]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Waist - narrow and defined */}
      <mesh position={[0, 1.55, 0]} castShadow scale={[waistScale * 0.7, 1.1, waistScale * 0.55]}>
        <capsuleGeometry args={[0.25, 0.35, 24, 48]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Hips - wider and curved */}
      <mesh position={[0, 0.98, 0]} castShadow scale={[hipScale * 0.95, 1, hipScale * 0.82]}>
        <capsuleGeometry args={[0.36, 0.32, 24, 48]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Shoulder Joint */}
      <mesh position={[-0.38, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Shoulder Joint */}
      <mesh position={[0.38, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Upper Arm - slender */}
      <mesh position={[-0.38, 2.05, 0]} rotation={[0, 0, 0.08]} castShadow>
        <capsuleGeometry args={[0.075, 0.62, 16, 32]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Upper Arm */}
      <mesh position={[0.38, 2.05, 0]} rotation={[0, 0, -0.08]} castShadow>
        <capsuleGeometry args={[0.075, 0.62, 16, 32]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.42, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Elbow */}
      <mesh position={[0.42, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.46, 0.92, 0]} rotation={[0, 0, 0.12]} castShadow>
        <capsuleGeometry args={[0.068, 0.55, 16, 32]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Forearm */}
      <mesh position={[0.46, 0.92, 0]} rotation={[0, 0, -0.12]} castShadow>
        <capsuleGeometry args={[0.068, 0.55, 16, 32]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Hip Joint */}
      <mesh position={[-0.17, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Hip Joint */}
      <mesh position={[0.17, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Thigh */}
      <mesh position={[-0.17, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.92, 20, 40]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Thigh */}
      <mesh position={[0.17, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.92, 20, 40]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.17, -0.35, 0]} castShadow>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Knee */}
      <mesh position={[0.17, -0.35, 0]} castShadow>
        <sphereGeometry args={[0.115, 24, 24]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Shin */}
      <mesh position={[-0.17, -0.88, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.88, 20, 40]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Shin */}
      <mesh position={[0.17, -0.88, 0]} castShadow>
        <capsuleGeometry args={[0.095, 0.88, 20, 40]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.17, -1.36, 0]} castShadow>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Ankle */}
      <mesh position={[0.17, -1.36, 0]} castShadow>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Foot */}
      <mesh position={[-0.17, -1.46, 0.08]} castShadow>
        <boxGeometry args={[0.13, 0.09, 0.26]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Foot */}
      <mesh position={[0.17, -1.46, 0.08]} castShadow>
        <boxGeometry args={[0.13, 0.09, 0.26]} />
        <meshPhysicalMaterial 
          color="#f5d5c1"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Base Stand */}
      <mesh position={[0, -1.58, 0]} receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 48]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

// Male Mannequin - Broader shoulders, straighter torso, muscular build
function MaleMannequin({ height = 175, bust = 95, waist = 80, hip = 95 }: MannequinProps) {
  const heightScale = height / 175;
  const bustScale = bust / 95;
  const waistScale = waist / 80;
  const hipScale = hip / 95;

  return (
    <group position={[0, -1.65, 0]} scale={heightScale}>
      {/* Head - slightly larger and angular */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Neck - thicker */}
      <mesh position={[0, 2.72, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.115, 0.32, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Shoulders - broad and strong */}
      <mesh position={[0, 2.48, 0]} castShadow scale={[bustScale * 1.25, 0.85, bustScale * 0.7]}>
        <capsuleGeometry args={[0.4, 0.26, 24, 48]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Upper Chest - muscular */}
      <mesh position={[0, 2.08, 0]} castShadow scale={[bustScale * 1.05, 1, bustScale * 0.78]}>
        <capsuleGeometry args={[0.36, 0.5, 24, 48]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Waist - less defined, straighter */}
      <mesh position={[0, 1.48, 0]} castShadow scale={[waistScale * 0.88, 1.15, waistScale * 0.68]}>
        <capsuleGeometry args={[0.32, 0.38, 24, 48]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Hips - narrower, more rectangular */}
      <mesh position={[0, 0.9, 0]} castShadow scale={[hipScale * 0.88, 1, hipScale * 0.72]}>
        <capsuleGeometry args={[0.34, 0.32, 24, 48]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Shoulder Joint - larger */}
      <mesh position={[-0.52, 2.42, 0]} castShadow>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Shoulder Joint */}
      <mesh position={[0.52, 2.42, 0]} castShadow>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Upper Arm - muscular */}
      <mesh position={[-0.52, 1.98, 0]} rotation={[0, 0, 0.06]} castShadow>
        <capsuleGeometry args={[0.095, 0.68, 16, 32]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Upper Arm */}
      <mesh position={[0.52, 1.98, 0]} rotation={[0, 0, -0.06]} castShadow>
        <capsuleGeometry args={[0.095, 0.68, 16, 32]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Elbow */}
      <mesh position={[-0.56, 1.32, 0]} castShadow>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Elbow */}
      <mesh position={[0.56, 1.32, 0]} castShadow>
        <sphereGeometry args={[0.105, 20, 20]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Forearm */}
      <mesh position={[-0.6, 0.78, 0]} rotation={[0, 0, 0.08]} castShadow>
        <capsuleGeometry args={[0.088, 0.6, 16, 32]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Forearm */}
      <mesh position={[0.6, 0.78, 0]} rotation={[0, 0, -0.08]} castShadow>
        <capsuleGeometry args={[0.088, 0.6, 16, 32]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Hip Joint */}
      <mesh position={[-0.16, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Hip Joint */}
      <mesh position={[0.16, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Thigh - muscular */}
      <mesh position={[-0.16, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.125, 0.98, 20, 40]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Thigh */}
      <mesh position={[0.16, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.125, 0.98, 20, 40]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Knee */}
      <mesh position={[-0.16, -0.48, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Knee */}
      <mesh position={[0.16, -0.48, 0]} castShadow>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Shin */}
      <mesh position={[-0.16, -1.02, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.92, 20, 40]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Shin */}
      <mesh position={[0.16, -1.02, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.92, 20, 40]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Ankle */}
      <mesh position={[-0.16, -1.52, 0]} castShadow>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Ankle */}
      <mesh position={[0.16, -1.52, 0]} castShadow>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Left Foot - larger */}
      <mesh position={[-0.16, -1.62, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Right Foot */}
      <mesh position={[0.16, -1.62, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshPhysicalMaterial 
          color="#e8c4a8"
          roughness={0.5}
          metalness={0}
          clearcoat={0.2}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Base Stand */}
      <mesh position={[0, -1.74, 0]} receiveShadow>
        <cylinderGeometry args={[0.48, 0.48, 0.05, 48]} />
        <meshStandardMaterial color="#d5d5d5" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <capsuleGeometry args={[0.3, 1.8, 16, 32]} />
      <meshStandardMaterial color="#e8d4c0" roughness={0.5} />
    </mesh>
  );
}

interface MannequinViewer3DProps {
  height?: string;
  bust?: string;
  waist?: string;
  hip?: string;
  gender?: "nam" | "nu";
}

export function MannequinViewer3D({ height, bust, waist, hip, gender = "nu" }: MannequinViewer3DProps) {
  // Convert string to number, use defaults based on gender
  const defaultHeight = gender === "nu" ? 165 : 175;
  const defaultBust = gender === "nu" ? 82 : 95;
  const defaultWaist = gender === "nu" ? 65 : 80;
  const defaultHip = gender === "nu" ? 93 : 95;

  const heightNum = height ? parseFloat(height) : defaultHeight;
  const bustNum = bust ? parseFloat(bust) : defaultBust;
  const waistNum = waist ? parseFloat(waist) : defaultWaist;
  const hipNum = hip ? parseFloat(hip) : defaultHip;

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0.3, 4.2]} fov={45} />

          {/* Studio Lighting */}
          <ambientLight intensity={0.6} color="#fff8f0" />
          
          {/* Key Light */}
          <directionalLight 
            position={[4, 5, 4]} 
            intensity={1.3} 
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={15}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={6}
            shadow-camera-bottom={-3}
            shadow-bias={-0.0001}
          />
          
          {/* Fill Light */}
          <directionalLight 
            position={[-4, 4, 3]} 
            intensity={0.6} 
            color="#e8f2ff"
          />
          
          {/* Rim Light */}
          <directionalLight 
            position={[0, 4, -5]} 
            intensity={0.7} 
            color="#ffd8a8"
          />
          
          {/* Accent lights */}
          <pointLight position={[2, 1, 2]} intensity={0.35} color="#ffe4cc" distance={6} />
          <pointLight position={[-2, 1, 2]} intensity={0.35} color="#ffe4cc" distance={6} />

          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Ground plane for soft shadows */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -1.7, 0]} 
            receiveShadow
          >
            <planeGeometry args={[12, 12]} />
            <shadowMaterial opacity={0.12} />
          </mesh>

          {/* Render the appropriate mannequin based on gender */}
          {gender === "nu" ? (
            <FemaleMannequin 
              height={heightNum} 
              bust={bustNum} 
              waist={waistNum} 
              hip={hipNum}
              gender={gender}
            />
          ) : (
            <MaleMannequin 
              height={heightNum} 
              bust={bustNum} 
              waist={waistNum} 
              hip={hipNum}
              gender={gender}
            />
          )}

          {/* Controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2}
            minDistance={2.5}
            maxDistance={7}
            autoRotate={false}
            dampingFactor={0.04}
            enableDamping={true}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full pointer-events-none">
        Kéo để xoay • Cuộn để phóng to/thu nhỏ
      </div>
    </div>
  );
}