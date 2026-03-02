// src/components/MainContent.jsx
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const navigate = useNavigate();
  useGSAP(() => {
    // 1. Initial Container Reveal (scaling from the IntroMask end state)
    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });

    // 2. Backgrounds Animation
    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
    });

    // 3. Character Animation: Starts at -bottom-[150%] (CSS) and animates up to -25% (GSAP)
    gsap.to(".character", {
      scale: 1.4,
      x: "-50%",
      bottom: "-25%", // Final visible position
      rotate: 0,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
    });

  });

  // Mousemove Parallax Effect
  useEffect(() => {
    const main = document.querySelector(".main");

    const handleMouseMove = (e) => {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;

      // Parallax for sky and foreground (bg)
      gsap.to(".sky", {
        x: xMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
      });
      // You can add parallax for the character or other elements here too
    };

    main?.addEventListener("mousemove", handleMouseMove);

    return () => {
      main?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  return (
    <div className="main w-full rotate-[-10deg] scale-[1.7]">
      <div className="landing overflow-hidden relative w-full h-screen bg-black">
        {/* Navbar Section */}
        <Navbar />

        {/* Parallax Images Section */}
        <div className="imagesdiv relative overflow-hidden w-full h-screen">
          <img
            className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
            src="./sky.png"
            alt="Sky background"
          />
          <img
            className="absolute scale-[1.8] -rotate-3 bg top-0 left-0 w-full h-full object-cover"
            src="./bg.png"
            alt="Foreground background"
          />


          {/*  <img
            // The -bottom-[150%] CSS sets the initial off-screen position
            className="absolute character -bottom-[150%] left-1/2 -translate-x-1/2 h-150 rotate-[-20deg]"
        
         src="./girlbg.png"
            alt="Girl character"
          />
          */}



        <img
            // The -bottom-[150%] CSS sets the initial off-screen position
            className="absolute character -bottom-[150%] left-1/2 -translate-x-1/2 h-150 rotate-[-20deg]"
        
         src="./Girl.jpg"
            alt=" new Girl character"
          />



        </div>



        {/* Bottom Bar/Call to Action */}
        <div className="btmbar text-white absolute bottom-0 left-0 w-full py-16 px-10 bg-gradient-to-t from-black to-transparent">
          <button
            onClick={() => navigate("/create")}
            className="block mx-auto py-4 px-2 border rounded-md text-center text-2xl hover:bg-yellow-500 hover:text-black transition"
          >
            Create your blog
          </button>
        </div>
      </div>

      {/* Main Content / Info Section */}
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="cntnr flex flex-col md:flex-row text-white w-full h-[80%] px-4">
          <div className="limg relative w-full md:w-1/2 h-1/2 md:h-full">
            <img
              className="absolute scale-[0.6] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain max-h-full"
              src="./img.png"
              alt="Descriptive image"
            />
          </div>
          <div className="rg w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl mt-3">Still Running,</h1>
            <h1 className="text-4xl md:text-6xl lg:text-8xl mt-3">Not Hunting</h1>
            <p className="mt-8 text-xl font-[Helvetica_Now_Display]">
              With a smile that radiates pure, infectious joy, the young woman in the picture presents an image of vibrant confidence.
            </p>
            <p className="mt-3 text-xl font-[Helvetica_Now_Display]">
              Her expression is the centerpiece of her portrait, a genuine and unguarded moment of happiness that lights up her features.
            </p>
            <p className="mt-3 mb-6 text-xl font-[Helvetica_Now_Display]">
              She leans into the frame with an easy-going energy, her bright eyes crinkling at the corners, suggesting a personality that is both warm and spirited.
            </p>
            <button className="bg-yellow-500 px-8 py-6 text-black mb-3 text-4xl">
              Download Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;