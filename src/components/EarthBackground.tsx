"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

function Earth() {

const earthRef = useRef<THREE.Mesh>(null);

const texture = useLoader(
THREE.TextureLoader,
"/earth.jpg"
);

texture.colorSpace = THREE.SRGBColorSpace;

useFrame(()=>{
if(earthRef.current){
earthRef.current.rotation.y += 0.0015;
}
});

return(

<Sphere ref={earthRef} args={[2.8,96,96]}>

<meshStandardMaterial
map={texture}
roughness={1}
metalness={0}
/>

</Sphere>

);
}


function Atmosphere(){

return(

<Sphere args={[3.05,64,64]}>

<meshBasicMaterial
color="#22c55e"
transparent
opacity={0.04}
side={THREE.BackSide}
/>

</Sphere>

);
}


export default function EarthBackground(){

return(

<div className="fixed inset-0 -z-20 h-screen w-screen pointer-events-none overflow-hidden bg-[#020503]">

<Canvas
camera={{position:[0,0,8],fov:40}}
gl={{alpha:true,antialias:true}}
dpr={[1,1.5]}
>

{/* Lighting */}

<ambientLight intensity={0.5}/>

<pointLight
position={[10,5,8]}
intensity={1.4}
color="#ffffff"
/>

<pointLight
position={[-8,-4,5]}
intensity={0.9}
color="#22c55e"
/>

{/* Earth */}

<Earth/>

{/* Atmosphere */}

<Atmosphere/>

</Canvas>

{/* soft environmental glow */}

<div
className="absolute inset-0 pointer-events-none"
style={{
background:
"radial-gradient(ellipse at 30% 60%, rgba(34,197,94,0.08), transparent 50%)"
}}
/>

{/* vignette */}

<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_#050a06_100%)]"/>

</div>

);

}