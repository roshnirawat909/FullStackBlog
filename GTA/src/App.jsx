/*import React, { useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";


function App() {

  let [showContent, setShowContent] = useState(false);
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          document.querySelector(".svg").remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-1",
      ease: "Expo.easeInOut",
    });

    gsap.to(".sky", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".bg", {
      scale: 1.1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".character", {
      scale: 1.4,
      x: "-50%",
      bottom: "-25%",
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      delay: "-.8",
      ease: "Expo.easeInOut",
    });

    const main = document.querySelector(".main");

    main?.addEventListener("mousemove", function (e) {
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
      });
      gsap.to(".sky", {
        x: xMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
      });
    });
  }, [showContent]);

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-100 w-full h-screen overflow-hidden bg-black">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="250"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="Arial Black"
                >
                 BLOG
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="./bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      {showContent && (
        <div className="main w-full rotate-[-10deg] scale-[1.7]">
          <div className="landing overflow-hidden relative w-full h-screen bg-black">
            <div className="navbar absolute top-0 left-0 z-10 w-full py-10 px-10">
              <div className="logo flex gap-7">

                <header class="fixed top-0 left-0 w-full  z-50">
                  <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="flex h-16 items-center">

                      <a href="/" class="flex items-center gap-2 text-white font-bold  text-3xl ">
                        
                        BLOGIFYHUB
                      </a>


                      <div class="ml-auto flex items-center gap-3">
                        <a href="/posts" class="px-3 py-2 text-3xl   font-medium text-white hover:text-white">All Post</a>
                        <a href="/login" class="px-3 py-2 text-3xl font-medium text-white hover:text-white">Login</a>
                        <a href="/signin" class="px-3 py-2 text-3xl font-medium  text-white hover:text-white">Sign in</a>
                        <button class="px-3 py-2 text-3xl font-semibold rounded-md bg-white  text-center  text-black hover:bg-white/90">
                          Logout
                        </button>
                      </div>
                    </div>
                  </nav>
                </header>


              </div>
            </div>

            <div className="imagesdiv relative overflow-hidden w-full h-screen">
              <img
                className="absolute sky scale-[1.5] rotate-[-20deg] top-0 left-0 w-full h-full object-cover"
                src="./sky.png"
                alt=""
              />
              <img
                className="absolute scale-[1.8] -rotate-3 bg top-0 left-0 w-full h-full object-cover"
                src="./bg.png"
                alt=""
              />
          
              <img
                className="absolute character -bottom-[150%]  left-1/2 -translate-x-1/2   h-150 rotate-[-20deg]"
                src="./girlbg.png"
                alt=""
              />
            </div>
            <div className="btmbar text-white absolute bottom-0 left-0 w-full py-15 px-10 bg-linear-to-t from-black to-transparent">
             


              <button
                id="createBlog"
                className="block mx-auto py-4 px-2 border rounded-md text-center text-2xl"
              >
                Create your blog
              </button>
            </div>
          </div>
          <div className="w-full h-screen flex items-center justify-center bg-black  ">
            <div className="cntnr flex text-white w-full h-[80%] ">
              <div className="limg relative w-1/2 h-full">
                <img
                  className="absolute scale-[0.6] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="./img.png"
                  alt=""
                />
              </div>
              <div className="rg w-[50%]  ">
                <h1 className="text-8xl mt-3 ">Still Running,</h1>
                <h1 className="text-8xl mt-3">Not Hunting</h1>
                <p className=" mt-8 text-xl font-[Helvetica_Now_Display]">
                  With a smile that radiates pure,
                  infectious joy, the young woman in the picture
                  presents an image of vibrant confidence.

                </p>
                <p className="  mt-3 text-xl font-[Helvetica_Now_Display]">
                  Her expression is the centerpiece of her portrait,
                  a genuine and unguarded moment of happiness that lights
                  up her features.
                </p>
                <p className=" mt-3  mb-6 text-xl font-[Helvetica_Now_Display]">
                  She leans into the frame with an easy-going energy, her
                  bright eyes crinkling at the corners, suggesting a personality that is both warm and spirited.

                </p>
                <button className="bg-yellow-500 px-8 py-6 text-black mb-3 text-4xl">
                  Download Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App; */

// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "remixicon/fonts/remixicon.css"; // Keep external CSS imports here
// Import the new components
import IntroMask from "./components/IntroMask";
import AppRoutes from "./route/routes";

function App() {
  // showContent controls which part of the application is rendered
  const [showContent, setShowContent] = useState(false);

  return (
    <Router>
      <>
        {/* The IntroMask component handles its own GSAP timeline.
          When its animation is almost complete, it calls setShowContent(true).
        */}
        {!showContent && <IntroMask setShowContent={setShowContent} />}
        
        {/* The AppRoutes component renders different pages based on the URL
          It's only rendered after the intro animation is complete.
        */}
        {showContent && <AppRoutes />}
      </>
    </Router>
  );
}

export default App;