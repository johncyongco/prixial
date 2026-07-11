/* ============================================
   Network Visualization
   Prixial — Living Data Background
   ============================================ */

(function () {
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let centerX, centerY;
  let mouseX = -1000;
  let mouseY = -1000;
  let time = 0;

  const NODE_COUNT = 160;
  const CONNECTION_DISTANCE = 200;
  const MOUSE_INFLUENCE = 120;

  let nodes = [];

  const conceptLabels = [
    'Dataset Discovery', 'Open Data', 'Human Validation',
    'AI Evaluation', 'Governance', 'Compliance',
    'Quality Assurance', 'Security', 'Risk Intelligence',
    'GIS', 'Research', 'Healthcare', 'Finance',
    'Legal', 'Computer Vision', 'NLP', 'Robotics',
    'Satellite Data', 'Synthetic Data', 'Annotation',
    'Responsible AI'
  ];

  // ---- Blinking label system ----
  let labelPool = [];
  let activeLabels = [];
  const MAX_ACTIVE = 3;
  const LABEL_FADE_SPEED = 0.015;
  const LABEL_CYCLE_MIN = 120;
  const LABEL_CYCLE_MAX = 300;
  let nextCycle = 0;

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function initLabelSystem() {
    labelPool = shuffleArray([...conceptLabels]);
    activeLabels = [];
    scheduleNextCycle();
  }

  function scheduleNextCycle() {
    nextCycle = time + LABEL_CYCLE_MIN + Math.random() * (LABEL_CYCLE_MAX - LABEL_CYCLE_MIN);
  }

  function pickLabelFromPool() {
    if (labelPool.length === 0) {
      labelPool = shuffleArray([...conceptLabels]);
    }
    return labelPool.pop();
  }

  function updateLabelSystem() {
    // Spawn new labels when cycle triggers and we have room
    if (time >= nextCycle && activeLabels.length < MAX_ACTIVE) {
      const count = 1 + Math.floor(Math.random() * 2); // 1 or 2 at a time
      for (let i = 0; i < count && activeLabels.length < MAX_ACTIVE; i++) {
        const text = pickLabelFromPool();
        // Find a node far enough from existing active labels
        const candidate = findNodeForLabel(text);
        if (candidate) {
          activeLabels.push({
            node: candidate,
            text: text,
            alpha: 0,
            targetAlpha: 1,
            life: 0,
            maxLife: 200 + Math.random() * 300,
            fading: false
          });
          candidate.hasLabel = true;
        }
      }
      scheduleNextCycle();
    }

    // Update active labels
    for (let i = activeLabels.length - 1; i >= 0; i--) {
      const label = activeLabels[i];
      label.life++;

      // Start fading out near end of life
      if (label.life > label.maxLife * 0.7) {
        label.fading = true;
      }

      // Fade in
      if (!label.fading) {
        label.alpha = Math.min(1, label.alpha + LABEL_FADE_SPEED);
      } else {
        label.alpha = Math.max(0, label.alpha - LABEL_FADE_SPEED);
      }

      // Remove dead labels
      if (label.alpha <= 0 && label.fading) {
        label.node.hasLabel = false;
        activeLabels.splice(i, 1);
      }
    }
  }

  function findNodeForLabel(text) {
    // Try to find a node without a label, preferring spread-out positions
    let bestNode = null;
    let bestMinDist = 0;

    for (let attempt = 0; attempt < 20; attempt++) {
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      if (node.hasLabel) continue;

      // Check distance from other active labels
      let minDist = Infinity;
      for (const al of activeLabels) {
        const dx = node.x - al.node.x;
        const dy = node.y - al.node.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        minDist = Math.min(minDist, d);
      }

      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestNode = node;
      }
    }

    return bestNode;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * (Math.min(width, height) * 0.48);
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;

      nodes.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 1 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.3,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.0002 + Math.random() * 0.0006,
        driftRadius: 2 + Math.random() * 12,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.01,
        hasLabel: false
      });
    }
  }

  function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];

      // Connection to center
      const dxC = a.x - centerX;
      const dyC = a.y - centerY;
      const distC = Math.sqrt(dxC * dxC + dyC * dyC);

      if (distC < 450) {
        const alpha = Math.max(0, 1 - distC / 450) * 0.05;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(a.x, a.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Node-to-node
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.035;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 0.35;
          ctx.stroke();
        }
      }
    }
  }

  function drawNodes() {
    nodes.forEach((node) => {
      const pulse = Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.5 + 0.5;
      let finalAlpha = node.alpha + pulse * 0.08;

      // Mouse proximity
      const dxM = node.x - mouseX;
      const dyM = node.y - mouseY;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM < MOUSE_INFLUENCE) {
        finalAlpha += (1 - distM / MOUSE_INFLUENCE) * 0.25;
      }

      finalAlpha = Math.min(1, finalAlpha);

      // Subtle glow for labeled nodes
      if (node.hasLabel) {
        const gr = node.size * 6 + pulse * 4;
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, gr);
        grad.addColorStop(0, `rgba(255, 255, 255, ${finalAlpha * 0.12})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, gr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha})`;
      ctx.fill();
    });
  }

  function drawLabels() {
    ctx.font = '400 9px "IBM Plex Mono", monospace';
    ctx.textBaseline = 'middle';

    activeLabels.forEach((label) => {
      const node = label.node;
      const pulse = Math.sin(time * 0.01 + label.node.pulsePhase) * 0.15;
      const a = Math.max(0, Math.min(1, label.alpha + pulse));

      if (a <= 0) return;

      // Glow behind text
      const textWidth = ctx.measureText(label.text.toUpperCase()).width;
      const glowGrad = ctx.createRadialGradient(
        node.x + node.size + 8 + textWidth / 2, node.y,
        0,
        node.x + node.size + 8 + textWidth / 2, node.y,
        textWidth * 0.6
      );
      glowGrad.addColorStop(0, `rgba(255, 255, 255, ${a * 0.06})`);
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(node.x + node.size + 8 + textWidth / 2, node.y, textWidth * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.75})`;
      ctx.textAlign = 'left';
      ctx.fillText(label.text.toUpperCase(), node.x + node.size + 8, node.y);
    });
  }

  function updateNodes() {
    nodes.forEach((node) => {
      node.driftAngle += node.driftSpeed;
      const driftX = Math.cos(node.driftAngle) * node.driftRadius;
      const driftY = Math.sin(node.driftAngle) * node.driftRadius;

      const dxM = node.x - mouseX;
      const dyM = node.y - mouseY;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      let repelX = 0, repelY = 0;

      if (distM < MOUSE_INFLUENCE * 2 && distM > 0) {
        const force = (1 - distM / (MOUSE_INFLUENCE * 2)) * 0.4;
        repelX = (dxM / distM) * force;
        repelY = (dyM / distM) * force;
      }

      const toBaseX = (node.baseX + driftX - node.x) * 0.001;
      const toBaseY = (node.baseY + driftY - node.y) * 0.001;

      node.vx += toBaseX + repelX * 0.02;
      node.vy += toBaseY + repelY * 0.02;
      node.vx *= 0.98;
      node.vy *= 0.98;

      node.x += node.vx;
      node.y += node.vy;
    });
  }

  function animate() {
    time++;
    ctx.clearRect(0, 0, width, height);

    updateNodes();
    updateLabelSystem();
    drawConnections();
    drawNodes();
    drawLabels();

    requestAnimationFrame(animate);
  }

  // Events
  window.addEventListener('resize', () => {
    resize();
    createNodes();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Init
  resize();
  createNodes();
  initLabelSystem();
  animate();
})();