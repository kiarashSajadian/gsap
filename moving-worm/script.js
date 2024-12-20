// Import the `pointsInPath` function from a CDN
// This utility calculates points along an SVG path.
import { pointsInPath } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.0";

// Select the SVG container where the animation will take place
const stage = document.querySelector("svg");

// Select the <path> element from the SVG
// This path determines the shape along which points are generated.
const path = document.querySelector("path");

// Generate 150 points along the path using the utility function
// Each point will be an object with x and y coordinates.
const pts = pointsInPath(path, 150);

// Variable to track the currently scaled-up circle
let currentScaledCircle = null;

// Loop through each point to create and place a circle at that position
pts.forEach((pt, i) => {
  // Create a new SVG <circle> element for each point
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  // Add the circle to the SVG container
  stage.appendChild(circle);

  // Use GSAP to set the initial attributes and style for the circle
  gsap.set(circle, {
    attr: {
      cx: pt.x + 9, // Position the circle along the x-axis
      cy: pt.y + 9, // Position the circle along the y-axis
      r: 5, // Radius of the circle
      fill: "#fff", // Initial fill color of the circle (white)
      stroke: "#111", // Border color of the circle (dark gray)
      "stroke-width": 0.3, // Border thickness
    },
  });

  // Add hover event listeners to change the color of the circles
  circle.addEventListener("mouseenter", () => {
    gsap.to(circle, {
      fill: "#ccc", // Change to a tomato color when hovering
      duration: 0.3, // Smooth transition effect
    });
  });

  circle.addEventListener("mouseleave", () => {
    gsap.to(circle, {
      fill: "#fff", // Revert to the original white color when hover ends
      duration: 0.3, // Smooth transition effect
    });
  });

  // Add click event listener to toggle scale on click
  circle.addEventListener("click", () => {
    if (currentScaledCircle === circle) {
      // If the clicked circle is already scaled, reset its scale
      gsap.to(circle, {
        scale: 1, // Reset scale
        duration: 0.5,
        ease: "power2.in",
      });
      currentScaledCircle = null; // Reset the tracking of scaled circle
    } else {
      // If the clicked circle is not scaled, scale it up
      gsap.to(circle, {
        scale: 1.5, // Scale up by 1.5 times
        duration: 0.5, // Duration for the scaling animation
        ease: "power2.out", // Easing for the scaling effect
      });

      // Update the tracking variable to the currently scaled circle
      currentScaledCircle = circle;
    }
  });
});

// Create a GSAP timeline to manage animations
const tl = gsap.timeline();

// Add the first animation to the timeline: rotation
tl.to("circle", {
  duration: 17, // Each circle rotates over 17 seconds
  transformOrigin: "50%", // Rotate around the center of each circle
  rotate: -360, // Rotate counter-clockwise by 360 degrees
  ease: "none", // No easing, so the rotation is linear
  repeat: -1, // Loop the animation infinitely
});

// Add a second animation to the timeline: noise-based movement
tl.to(
  "circle",
  {
    duration: 3, // Each circle moves for 3 seconds
    ease: "power2.inOut", // Smooth start and end to the motion
    yoyo: true, // Reverses the motion at the end of each cycle
    repeat: -1, // Loop the animation infinitely
    x: (i) => noise.perlin2(pts[i].x / 33, pts[i].y / 33) * 9, // Generate smooth x-offset using Perlin noise
    y: (i) => noise.perlin2(pts[i].x / 33, pts[i].y / 33) * 9, // Generate smooth y-offset using Perlin noise
    repeatRefresh: true, // Refresh the x and y values on each repetition
    onRepeat: () => noise.seed(Math.random()), // Randomize the noise pattern on each loop
  },
  0
); // Starts this animation at the same time as the previous one

// Add interactivity: click anywhere to toggle play/pause
window.onpointerup = () => {
  gsap.to(tl, {
    duration: 1, // Transition time when toggling
    ease: "sine.inOut", // Smooth transition
    timeScale: tl.isActive() ? 0 : 1, // Pause if active, play if paused
  });
};
