import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Renders the full-screen SVG text mask animation.
 * When the animation is nearly complete, it sets showContent to true,
 * which signals the parent component (App.jsx) to hide the mask
 * and display the main content.
 *
 * @param {object} props
 * @param {function} props.setShowContent - Function to toggle the main content visibility.
 */
const IntroMask = ({ setShowContent }) => {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      // Step 1: Rotate the masked group
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      // Step 2: Scale up and fade out the masked group to reveal the content
      scale: 10,
      duration: 2,
      delay: -1.8, // Start this animation 1.8 seconds before the first one ends
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        // Crucial logic: When the animation is almost done (e.g., 90% progress)
        if (this.progress() >= 0.9) {
          // 🛑 FIX: Do NOT manually call document.querySelector(".svg")?.remove();
          // Let React handle the removal/unmounting based on state.
          
          // 1. Set the state to true to trigger the main content display.
          setShowContent(true);
          
          // 2. Kill the animation to stop the onUpdate loop.
          this.kill(); 
        }
      },
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    // The 'svg' class is the selector used by React's parent (App.jsx) 
    // to conditionally render/unmount this entire block.
    <div className="svg flex items-center justify-center fixed top-0 left-0 z-50 w-full h-screen overflow-hidden bg-black">
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
          // Ensure this path points correctly to your background image file
          href="./bg.png" 
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#viMask)"
        />
      </svg>
    </div>
  );
};

export default IntroMask;