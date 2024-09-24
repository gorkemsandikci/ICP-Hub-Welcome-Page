import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Model } from './Model';
import { Stars } from '@react-three/drei';
import { Line } from '@react-three/drei';
import './styles.css'; // Ensure your styles are imported

const ShootingStars = () => {
  const starRefs = useRef([]);

  useEffect(() => {
    starRefs.current = starRefs.current.slice(0, 10).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
      ],
      trail: [],
      brightness: Math.random() > 0.95 ? 1 : 0.5,
      size: Math.random() * 0.1 + 0.1,
    }));
  }, []);

  useFrame(() => {
    starRefs.current.forEach((star) => {
      star.position[2] += 0.2;
      star.trail.push([star.position[0], star.position[1], star.position[2]]);
      if (star.trail.length > 5) {
        star.trail.shift();
      }
      if (star.position[2] > 2) {
        star.position[2] = -200;
        star.position[0] = (Math.random() - 0.5) * 200;
        star.position[1] = (Math.random() - 0.5) * 200;
        star.trail = [];
      }
    });
  });

  return (
    <>
      {starRefs.current.map((star, index) => (
        <React.Fragment key={index}>
          <mesh
            position={star.position}
            scale={[star.size, star.size, star.size]}
            visible
          >
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial emissive={star.brightness === 1 ? 'white' : 'gray'} />
          </mesh>
          {star.trail.length > 0 && (
            <Line
              points={star.trail}
              color="white"
              lineWidth={1}
              dashed={false}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

const RotatingModel = () => {
  const ref = useRef();

  const randomRotationSpeedX = Math.random() * -0.001;
  const randomRotationSpeedY = Math.random() * -0.001;
  const randomRotationSpeedZ = Math.random() * 0.001;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += randomRotationSpeedX;
      ref.current.rotation.y += randomRotationSpeedY;
      ref.current.rotation.z += randomRotationSpeedZ;
    }
  });

  return (
    <group ref={ref}>
      <Model />
    </group>
  );
}

// Custom Welcome Text Component with Movement
const WelcomeText = ({ text, side }) => {
  const words = text.split(" ");
  
  return (
    <div className={`welcome-container ${side}`}>
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="welcome-word-container">
          {word.split("").map((letter, index) => {
            // Randomize movement offsets
            const randomX = Math.random() * 10 - 5; // Move between -5 and 5
            const randomY = Math.random() * 10 - 5; // Move between -5 and 5

            return (
              <span
                key={index}
                className="welcome-word"
                style={{
                  transform: `translate(${randomX}px, ${randomY}px)`,
                  transition: 'transform 0.5s ease',
                  animation: `move 1s infinite alternate`, // Use keyframes for animation
                  animationDelay: `${index * 0.1}s`, // Delay each letter's animation
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Canvas
        style={{ background: 'black' }}
        camera={{ position: [0, 0, 2], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={10000} factor={4} saturation={0} fade={true} />
        
        <ShootingStars />
        <RotatingModel />
      </Canvas>
      {/* Two separate texts on left and right */}
      <WelcomeText text="Welcome to" side="left" />
      <WelcomeText text="ICP Hub Turkey" side="left" />
      <WelcomeText text="Explore the" side="right" />
      <WelcomeText text="Universe of Opportunities" side="right" />
      
    </div>
  );
}

export default App;
