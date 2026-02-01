document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  let currentSectionIndex = 0;
  let isAnimating = false;

  function switchSection(direction) {
    if (isAnimating) return;

    const nextIndex = currentSectionIndex + direction;

    // Bounds check
    if (nextIndex < 0 || nextIndex >= sections.length) return;

    // Start Transition
    isAnimating = true;
    const currentSection = sections[currentSectionIndex];
    const nextSection = sections[nextIndex];

    // Sequence: 
    // 1. Fade out current
    // 2. Wait
    // 3. Fade in next

    // Step 1: Fade out current
    currentSection.classList.add('fading-out');

    // Step 2: Wait for fade out
    setTimeout(() => {
      currentSection.classList.remove('active', 'fading-out');
      nextSection.classList.add('active'); // Display block
      nextSection.classList.add('fading-out'); // Ensure it starts hidden

      // Step 3: Fade In Next
      // Slight delay to ensure DOM update
      setTimeout(() => {
        nextSection.classList.remove('fading-out');

        // Complete
        setTimeout(() => {
          isAnimating = false;
        }, 800); // Wait for fade in
      }, 50);

    }, 800); // Match CSS transition time

    currentSectionIndex = nextIndex;
  }

  // Scroll Listener
  window.addEventListener('wheel', (e) => {
    // Simple threshold to avoid sensitive trackpads triggering too easily
    if (Math.abs(e.deltaY) < 20) return;

    if (e.deltaY > 0) {
      // Scroll Down -> Next
      switchSection(1);
    } else {
      // Scroll Up -> Prev
      switchSection(-1);
    }
  }, { passive: false });

  // Link Interception for Smooth Transition to Gallery (List)
  const galleryLink = document.getElementById('link-gallery');
  if (galleryLink) {
    galleryLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Fade out current body
      document.body.style.transition = 'opacity 0.8s ease';
      document.body.style.opacity = '0';

      // Navigate after fade
      setTimeout(() => {
        window.location.href = 'list/'; // Goes to list/index.html
      }, 800);
    });
  }

  // Link Interception for Essay
  const essayLink = document.getElementById('link-essay');
  if (essayLink) {
    essayLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.8s ease';
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.href = 'essay/'; // Goes to essay/index.html
      }, 800);
    });
  }

  // Initial State Check
  sections[0].classList.add('active');
  sections.forEach(sec => sec.classList.remove('fading-out'));
});
