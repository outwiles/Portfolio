document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- ripple / tap feedback on every clickable surface ---------- */
  function addRipple(el, x, y){
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (x - rect.left - size / 2) + 'px';
    span.style.top = (y - rect.top - size / 2) + 'px';
    el.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  document.querySelectorAll('.btn, .social-btn').forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      if (reduceMotion) return;
      const x = e.clientX ?? el.getBoundingClientRect().left;
      const y = e.clientY ?? el.getBoundingClientRect().top;
      addRipple(el, x, y);
    });
  });

  /* ---------- pressed feel on touch for the social icons ---------- */
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('touchstart', () => btn.classList.add('tap-active'), { passive: true });
    const release = () => setTimeout(() => btn.classList.remove('tap-active'), 140);
    btn.addEventListener('touchend', release);
    btn.addEventListener('touchcancel', release);
  });

  /* ---------- magnetic pull toward the cursor (desktop only) ---------- */
  if (isFinePointer && !reduceMotion) {
    document.querySelectorAll('.social-btn, .btn').forEach(el => {
      const pull = el.classList.contains('social-btn') ? 0.35 : 0.16;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transition = 'transform 0.12s ease-out';
        el.style.transform = `translate(${relX * pull}px, ${relY * pull}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
      });

      el.addEventListener('pointerdown', () => {
        el.style.transition = 'transform 0.08s ease';
        el.style.transform += ' scale(0.9)';
      });
    });
  }

  /* ---------- gentle 3D tilt on the portrait ---------- */
  const portrait = document.querySelector('.portrait');
  if (portrait && isFinePointer && !reduceMotion) {
    portrait.addEventListener('mousemove', (e) => {
      const rect = portrait.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      portrait.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
    });
    portrait.addEventListener('mouseleave', () => {
      portrait.style.transition = 'transform 0.4s ease';
      portrait.style.transform = '';
      setTimeout(() => { portrait.style.transition = ''; }, 400);
    });
  }

  /* ---------- ambient glow that trails the pointer ---------- */
  if (isFinePointer && !reduceMotion) {
    const glow = document.createElement('div');
    glow.className = 'pointer-glow';
    document.body.appendChild(glow);
    window.addEventListener('mousemove', (e) => {
      glow.classList.add('active');
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }
});
