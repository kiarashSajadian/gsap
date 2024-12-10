<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script>
function isDesktopView() {
  return window.innerWidth >= 992; // Modify 992 to set the breakpoint at which you want the animation to apply.
}

gsap.registerPlugin(ScrollTrigger)

let navbarScrollTrigger;

function initNavbarScrollAnimation() {
  if (isDesktopView() && !navbarScrollTrigger) {
    const navbarShowAnim = gsap.from('.navbar', { // Ensure your Navbar has the .navbar class, or update the class
      yPercent: -100,
      paused: true,
      duration: 0.2
    }).progress(1);

    navbarScrollTrigger = ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        self.direction === -1 ? navbarShowAnim.play() : navbarShowAnim.reverse();
      }
    });
  }
}


function destroyNavbarScrollAnimation() {
  if (navbarScrollTrigger) {
    navbarScrollTrigger.kill();
    navbarScrollTrigger = null;
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  if (!isDesktopView()) {
    destroyNavbarScrollAnimation();
  } else {
    initNavbarScrollAnimation();
  }
});

initNavbarScrollAnimation();

</script>
