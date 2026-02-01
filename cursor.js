// Custom Cursor System
// Rotating crosshair that snaps to clickable element boundaries on hover

(function () {
  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.innerHTML = `
    <div class="cursor-crosshair">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <g fill="none" stroke="#000" stroke-width="1.5">
          <path d="M4 4 L4 10" />
          <path d="M4 4 L10 4" />
          <path d="M28 4 L28 10" />
          <path d="M28 4 L22 4" />
          <path d="M4 28 L4 22" />
          <path d="M4 28 L10 28" />
          <path d="M28 28 L28 22" />
          <path d="M28 28 L22 28" />
          <path d="M16 12 L16 20" />
          <path d="M12 16 L20 16" />
        </g>
      </svg>
    </div>
    <div class="cursor-pointer">
      <svg viewBox="0 0 16 16" width="16" height="16">
        <g fill="none" stroke="#000" stroke-width="1.5">
          <path d="M8 4 L8 12" />
          <path d="M4 8 L12 8" />
        </g>
      </svg>
    </div>
    <div class="cursor-snap">
      <div class="cursor-corner cursor-tl"></div>
      <div class="cursor-corner cursor-tr"></div>
      <div class="cursor-corner cursor-bl"></div>
      <div class="cursor-corner cursor-br"></div>
    </div>
  `;
  document.body.appendChild(cursor);

  // Cursor state
  let mouseX = 0, mouseY = 0;
  let rotation = 0;
  let isHovering = false;
  let targetRect = null;

  // Selectors for clickable elements
  const clickableSelector = 'a, button, [role="button"], .selection-link, .list-entry, .grid-item, .essay-artwork-item, .toggle-option, .nav-item, .nav-strip-btn, .clickable';

  // Update cursor position
  function updateCursor() {
    const crosshair = cursor.querySelector('.cursor-crosshair');
    const pointer = cursor.querySelector('.cursor-pointer');
    const snap = cursor.querySelector('.cursor-snap');

    if (isHovering && targetRect) {
      // Hover mode: show just the + pointer and snap corners
      crosshair.style.opacity = '0';
      pointer.style.opacity = '1';
      pointer.style.left = mouseX + 'px';
      pointer.style.top = mouseY + 'px';
      pointer.style.transform = 'translate(-50%, -50%)';

      snap.style.opacity = '1';
      snap.style.left = targetRect.left + 'px';
      snap.style.top = targetRect.top + 'px';
      snap.style.width = targetRect.width + 'px';
      snap.style.height = targetRect.height + 'px';
    } else {
      // Normal mode: show rotating full cursor, hide pointer and snap
      crosshair.style.opacity = '1';
      crosshair.style.left = mouseX + 'px';
      crosshair.style.top = mouseY + 'px';
      crosshair.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

      pointer.style.opacity = '0';
      snap.style.opacity = '0';
    }

    requestAnimationFrame(updateCursor);
  }

  // Rotate crosshair continuously (always rotate, even during hover)
  function rotateCursor() {
    rotation += 2.0; // Faster rotation
    if (rotation >= 360) rotation = 0;
    requestAnimationFrame(rotateCursor);
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Check for clickable elements
  document.addEventListener('mouseover', (e) => {
    const clickable = e.target.closest(clickableSelector);
    if (clickable) {
      isHovering = true;
      targetRect = clickable.getBoundingClientRect();
    }
  });

  document.addEventListener('mouseout', (e) => {
    const clickable = e.target.closest(clickableSelector);
    if (clickable) {
      // Check if we're moving to another clickable
      const relatedClickable = e.relatedTarget?.closest(clickableSelector);
      if (!relatedClickable) {
        isHovering = false;
        targetRect = null;
      }
    }
  });

  // Handle scroll - update rect position
  window.addEventListener('scroll', () => {
    if (isHovering && targetRect) {
      const hovered = document.elementFromPoint(mouseX, mouseY);
      const clickable = hovered?.closest(clickableSelector);
      if (clickable) {
        targetRect = clickable.getBoundingClientRect();
      }
    }
  }, { passive: true });

  // Start animation loops
  updateCursor();
  rotateCursor();

  // Hide default cursor site-wide
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }
  `;
  document.head.appendChild(style);
})();
