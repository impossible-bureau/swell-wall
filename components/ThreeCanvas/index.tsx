import { Canvas } from '@react-three/fiber';
import { ReactNode, useRef } from 'react';
import CameraSettings from './CameraSettings';
// import Signature from '../Signature';
import { extend } from '@react-three/fiber';

// import { MeshLine, MeshLineMaterial } from 'three.meshline';
import styled from 'styled-components';

// extend({ MeshLine, MeshLineMaterial });

export type ThreeCanvasProps = {
  children: ReactNode;
};

const ThreeDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: white;
`;

const ThreeCanvas = ({ children }: ThreeCanvasProps) => {
  const dpr = global?.window?.devicePixelRatio || 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <ThreeDiv>
      <Canvas dpr={[dpr, dpr]} ref={canvasRef}>
        <CameraSettings />
        {/* <Signature /> */}
        {children}
      </Canvas>
    </ThreeDiv>
  );
};

export default ThreeCanvas;
