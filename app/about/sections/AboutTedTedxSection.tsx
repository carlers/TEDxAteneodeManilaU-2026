"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { div } from "three/src/nodes/tsl/TSLBase.js";

function ParticleWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const particlesRef = useRef<THREE.Sprite[]>([]);
  const animationRef = useRef<number>();
  const countRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const DENSITY = 50;
  const SPEED = 0.1;
  const AMPLITUDE = 50;
  const SEPARATION = 100;

  useEffect(() => {
    if (!containerRef.current) return;

    const windowHalf = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000
    );
    camera.position.z = 1000;
    camera.position.y = 800;
    cameraRef.current = camera;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // transparent bg
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Material
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2, true);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

    // Particles
    for (let ix = 0; ix < DENSITY; ix++) {
      for (let iy = 0; iy < DENSITY; iy++) {
        const particle = new THREE.Sprite(material);
        particle.position.x = ix * SEPARATION - (DENSITY * SEPARATION) / 2;
        particle.position.z = iy * SEPARATION - (DENSITY * SEPARATION) / 2;
        particle.position.y = -400;
        particle.scale.setScalar(10);
        particlesRef.current.push(particle);
        scene.add(particle);
      }
    }

    // Animate
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      let i = 0;
      for (let ix = 0; ix < DENSITY; ix++) {
        for (let iy = 0; iy < DENSITY; iy++) {
          const particle = particlesRef.current[i++];
          particle.position.y =
            -400 +
            Math.sin((ix + countRef.current) * 0.3) * AMPLITUDE +
            Math.sin((iy + countRef.current) * 0.5) * AMPLITUDE;
          const scale =
            (Math.sin((ix + countRef.current) * 0.3) + 1) * 2 +
            (Math.sin((iy + countRef.current) * 0.5) + 1) * 2;
          particle.scale.setScalar(scale * 2);
        }
      }

      renderer.render(scene, camera);
      countRef.current += SPEED;
    };
    animate();

    // Events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX - windowHalf.x;
      mouseRef.current.y = e.clientY - windowHalf.y;
    };
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-64" />;
}

export default function AboutTedTedxSection() {
  return (
    <section id="about-tedx-ateneo" className="bg-tedx-black text-tedx-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 pt-14 sm:px-6 sm:pt-16 md:px-10 md:pt-20 lg:flex-row lg:gap-32 lg:px-24 lg:pt-24">
        <div className="w-full shrink-0 lg:w-[610px]">
          <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <h2 className="font-league-gothic text-[clamp(4rem,17vw,128px)] leading-none tracking-[-0.05em] lg:text-[128px]">
              ABOUT <span className="text-tedx-red">TED</span>
            </h2>
            <a href="https://www.ted.com/about/programs-initiatives/tedx-program"
              target="_blank"
              rel="noopener noreferrer"
              className="
              group relative ml-0 flex h-20 w-20 shrink-0 items-center justify-center rounded-full
              sm:ml-4 sm:h-24 sm:w-24
                            bg-tedx-red
                            active:bg-tedx-gray active:scale-95
                            transition-all duration-150 cursor-pointer
                        "
            >

              <span
                className="
                            absolute h-[112px] w-[112px] rounded-full sm:h-[138px] sm:w-[138px]
                            bg-[url('/btn-hvr-splat.png')] bg-cover bg-center
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-200
                            "
              />
              <span
                className="
                            relative z-10 rotate-[10deg]
                            font-inter text-center text-[0.95rem] font-bold leading-tight tracking-[-0.03em] sm:text-[1.1rem]
                            text-tedx-white group-hover:text-tedx-red active:text-tedx-red
                            "
              >
                LEARN<br />MORE
              </span>
            </a>
          </div>
          <div className="space-y-6 text-[15px] leading-7 text-tedx-white sm:text-[16px] sm:leading-wide">
            <p>
              <span className="text-tedx-red font-bold">TED is an</span> annual
              event where some of the world's leading thinkers and doers are
              invited to share what they are most passionate about. "TED" stands
              for Technology, Entertainment, Design — three broad subject areas
              that are, collectively, shaping our future. And in fact, the event
              is broader still, showcasing ideas that matter in any discipline.
              Attendees have called it "the ultimate brain spa" and "a four-day
              journey into the future." The diverse audience — CEOs, scientists,
              creatives, philanthropists — is almost as extraordinary as the
              speakers, who have included Bill Clinton, Bill Gates, Jane
              Goodall, Frank Gehry, Paul Simon, Sir Richard Branson, Philippe
              Starck and Bono.
            </p>
            <p>
              <span className="text-tedx-red font-bold">TED was</span> first
              held in Monterey, California, in 1984. In 2001, Chris Anderson's
              Sapling Foundation acquired TED from its founder, Richard Saul
              Wurman. In recent years, TED has expanded to include an
              international conference, TEDGlobal; media initiatives, including
              TED Talks and TED.com; and the TED Prize. TED2010, “What the world
              Needs Now,” will be held Feb 9-13, 2010, in Long Beach, California,
              with a simulcast event in Palm Springs, California. TEDGlobal 2009,
              “The Substance of Things Not Seen,” will be held July 21-24, 2009,
              in Oxford, UK and TEDIndia will be held in November 2009.
            </p>
          </div>
        </div>

        <div className="w-full shrink-0 lg:w-[480px]">
          <h2 className="mb-8 mt-2 font-league-gothic text-[clamp(4rem,17vw,128px)] leading-none tracking-tighter md:mt-4 lg:mt-36 lg:text-[128px]">
            ABOUT <span className="text-tedx-red">TEDx</span>
          </h2>
          <div className="space-y-6 text-[15px] leading-7 text-tedx-white sm:text-[16px] sm:leading-wide">
            <p>
              In the spirit of ideas worth spreading,{" "}
              <span className="text-tedx-red font-bold">TEDx is a</span>{" "}
              program of local, self-organized events that bring people together
              to share a TED-like experience.
            </p>
            <p>
              At a TEDx event, TEDTalks video and live speakers combine to spark
              deep discussion and connection in a small group. These local,
              self-organized events are branded TEDx, where x=independently
              organized TED event.
            </p>
            <p>
              The TED Conference provides general guidance for the TEDx program,
              but individual TEDx events are self-organized.*
            </p>
            <p className="text-tedx-muted-text text-caption">
              (*Subject to certain rules and regulations)
            </p>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <ParticleWaves />
      </div>
    </section>
  );
}