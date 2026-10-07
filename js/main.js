(() => {
  'use strict';

  const nav = document.querySelector('#nav');
  const menuButton = document.querySelector('#menu-button');
  const mobileNav = document.querySelector('#mobile-nav');

  const closeMenu = () => {
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  menuButton.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('is-open');
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    mobileNav.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const updateNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  const timeline = document.querySelector('#process-timeline');
  const steps = [...document.querySelectorAll('.process-step')];
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = steps.indexOf(entry.target);
      steps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex <= index));
      timeline.querySelector('.process__line span').style.width = `${((index + 1) / steps.length) * 100}%`;
    });
  }, { threshold: 0.8 });
  steps.forEach((step) => stepObserver.observe(step));

  const track = document.querySelector('#project-track');
  const projectNext = document.querySelector('#project-next');
  const projectPrev = document.querySelector('#project-prev');
  if (track && projectNext && projectPrev) {
    projectNext.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .72, behavior: 'smooth' }));
    projectPrev.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .72, behavior: 'smooth' }));
  }

  const screenData = [
    { brand: 'neph', score: '72', greeting: 'Good morning,<br><strong>Sam.</strong>' },
    { brand: 'pyl', score: '04', greeting: 'Make space<br><strong>to think.</strong>' },
    { brand: 'chronoa', score: '08', greeting: 'Recovery<br><strong>is a practice.</strong>' },
    { brand: 'agapetoi', score: '11', greeting: 'Know thyself<br><strong>in practice.</strong>' }
  ];
  const phoneBrand = document.querySelector('.phone__brand');
  const phoneGreeting = document.querySelector('.phone__greeting');
  const phoneScore = document.querySelector('.phone__signal strong');
  if (phoneBrand && phoneGreeting && phoneScore) {
    let screenIndex = 0;
    window.setInterval(() => {
      screenIndex = (screenIndex + 1) % screenData.length;
      const screen = screenData[screenIndex];
      [phoneBrand, phoneGreeting, phoneScore].forEach((element) => element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: 'ease-out' }));
      phoneBrand.firstChild.textContent = `${screen.brand} `;
      phoneGreeting.innerHTML = screen.greeting;
      phoneScore.textContent = screen.score;
    }, 4200);
  }

  const passagePreview = document.querySelector('#pyl-passage-preview');
  if (passagePreview) {
    const projectPoint = (x, y, z) => [600 + x * 580 / z, 300 - y * 580 / z];
    const passageLine = (a, b) => {
      const [x1, y1] = projectPoint(...a);
      const [x2, y2] = projectPoint(...b);
      return `<path d="M${x1},${y1}L${x2},${y2}"/>`;
    };
    const passagePlane = (points) => `<polygon points="${points.map((point) => projectPoint(...point).join(',')).join(' ')}"/>`;
    let paving = '';
    let walls = '';
    let galleries = '';
    for (let x = -12; x <= 12; x += 1) paving += passageLine([x, -2, 2], [x, -2, 24]);
    for (let z = 2; z <= 24; z += 1) {
      paving += passageLine([-12, -2, z], [12, -2, z]);
      for (const side of [-1, 1]) walls += passageLine([side * 3, -2, z], [side * 3, 7, z]);
    }
    for (let y = -2; y <= 7; y += .65) {
      for (const side of [-1, 1]) walls += passageLine([side * 3, y, 2], [side * 3, y, 24]);
    }
    for (const side of [-1, 1]) {
      for (const z of [3, 6, 9, 12, 15]) {
        const x = side * 3;
        galleries += passagePlane([[x, -2, z], [x, 1.8, z], [x, 1.8, z + 1.7], [x, -2, z + 1.7]]);
        galleries += passageLine([x, 1.8, z], [x + side * .35, 2.2, z]);
        galleries += passageLine([x + side * .35, 2.2, z], [x + side * .35, 2.2, z + 1.7]);
        galleries += passageLine([x + side * .35, 2.2, z + 1.7], [x, 1.8, z + 1.7]);
        galleries += passageLine([x, -.1, z + .35], [x, 1.15, z + .35]);
        galleries += passageLine([x, 1.15, z + .35], [x, 1.15, z + 1.3]);
        galleries += passageLine([x, 1.15, z + 1.3], [x, -.1, z + 1.3]);
        galleries += passageLine([x, -.1, z + 1.3], [x, -.1, z + .35]);
      }
    }
    const surfaces = passagePlane([[-3, -2, 2], [-3, 7, 2], [-3, 7, 24], [-3, -2, 24]]) + passagePlane([[3, -2, 2], [3, 7, 2], [3, 7, 24], [3, -2, 24]]);
    const frames = [5, 9, 15].map((z) => passageLine([-3, 4.6, z], [3, 4.6, z]) + passageLine([-3, 4.85, z], [3, 4.85, z]) + passageLine([-3, -2, z], [-3, 4.85, z]) + passageLine([3, -2, z], [3, 4.85, z])).join('');
    passagePreview.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice" fill="none" focusable="false"><g class="pyl-passage-surfaces">${surfaces}</g><g class="pyl-passage-grid">${paving}${walls}</g><g class="pyl-passage-galleries">${galleries}</g><g class="pyl-passage-frames">${frames}</g></svg>`);
  }

  const typingTargets = [...document.querySelectorAll('[data-type-text]')].sort((a, b) => Number(a.dataset.typeOrder || 0) - Number(b.dataset.typeOrder || 0));
  if (typingTargets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typingTargets.forEach((target) => {
      const output = target.querySelector('.pyl-type-output');
      const typingLine = target.querySelector('.pyl-type-line');
      if (typingLine) typingLine.style.width = `${Math.ceil(output.getBoundingClientRect().width + 5)}px`;
      output.textContent = '';
    });
    const typeTarget = (targetIndex) => {
      if (targetIndex >= typingTargets.length) return;
      const target = typingTargets[targetIndex];
      const output = target.querySelector('.pyl-type-output');
      const textToType = target.dataset.typeText;
      let characterIndex = 0;
      target.classList.add('is-typing');
      const typeCharacter = () => {
        characterIndex += 1;
        output.textContent = textToType.slice(0, characterIndex);
        if (characterIndex < textToType.length) {
          window.setTimeout(typeCharacter, Number(target.dataset.typeSpeed || 72));
        } else {
          window.setTimeout(() => {
            target.classList.remove('is-typing');
            typeTarget(targetIndex + 1);
          }, 260);
        }
      };
      window.setTimeout(typeCharacter, targetIndex === 0 ? 420 : 80);
    };
    typeTarget(0);
  }

  const orbGrid = document.querySelector('#pyl-orb-grid');
  if (orbGrid) {
    const projectOrbPoint = (x, y, z) => [600 + x * 580 / z, 300 - y * 580 / z];
    const orbLine = (a, b) => {
      const [x1, y1] = projectOrbPoint(...a);
      const [x2, y2] = projectOrbPoint(...b);
      return `<path d="M${x1},${y1}L${x2},${y2}"/>`;
    };
    const orbPlane = (points) => `<polygon points="${points.map((point) => projectOrbPoint(...point).join(',')).join(' ')}"/>`;
    const orbCurve = (a, control, b) => {
      const [x1, y1] = projectOrbPoint(...a);
      const [cx, cy] = projectOrbPoint(...control);
      const [x2, y2] = projectOrbPoint(...b);
      return `<path d="M${x1},${y1}Q${cx},${cy} ${x2},${y2}"/>`;
    };
    const orbScenes = [
      { id: 'museum', label: 'Casa Gorordo Museum' },
      { id: 'library', label: 'Cebu City Public Library' },
      { id: 'station', label: 'Cebu Railway' },
      { id: 'courtyard', label: 'Plaza Independencia' }
    ];
    const orbSceneLabel = document.querySelector('#pyl-orb-scene-label');
    let orbSceneIndex = 0;

    const renderOrbScene = () => {
      const scene = orbScenes[orbSceneIndex];
      const wallX = scene.id === 'station' ? 4.2 : 3.2;
      let orbFloor = '';
      let orbWalls = '';
      let orbArchitecture = '';
      let orbFrames = '';
      for (let x = -12; x <= 12; x += .75) orbFloor += orbLine([x, -2, 2], [x, -2, 26]);
      for (let z = 2; z <= 26; z += .8) {
        orbFloor += orbLine([-12, -2, z], [12, -2, z]);
        for (const side of [-1, 1]) orbWalls += orbLine([side * wallX, -2, z], [side * wallX, 7, z]);
      }
      for (let y = -2; y <= 7; y += .55) {
        for (const side of [-1, 1]) orbWalls += orbLine([side * wallX, y, 2], [side * wallX, y, 26]);
      }

      if (scene.id === 'museum') {
        for (const side of [-1, 1]) {
          for (const z of [3, 6.2, 9.4, 12.6, 15.8, 19]) {
            const x = side * wallX;
            orbArchitecture += orbPlane([[x, -2, z], [x, 2, z], [x, 2, z + 1.9], [x, -2, z + 1.9]]);
            orbArchitecture += orbLine([x, 2, z], [x + side * .4, 2.45, z]) + orbLine([x + side * .4, 2.45, z], [x + side * .4, 2.45, z + 1.9]) + orbLine([x + side * .4, 2.45, z + 1.9], [x, 2, z + 1.9]);
            orbArchitecture += orbLine([x, -.15, z + .38], [x, 1.25, z + .38]) + orbLine([x, 1.25, z + .38], [x, 1.25, z + 1.48]) + orbLine([x, 1.25, z + 1.48], [x, -.15, z + 1.48]) + orbLine([x, -.15, z + 1.48], [x, -.15, z + .38]);
          }
        }
        orbFrames = [4.8, 8.8, 13.6, 19].map((z) => orbLine([-wallX, 4.8, z], [wallX, 4.8, z]) + orbLine([-wallX, -2, z], [-wallX, 5.05, z]) + orbLine([wallX, -2, z], [wallX, 5.05, z])).join('');
      } else if (scene.id === 'library') {
        for (const side of [-1, 1]) {
          for (const z of [2.8, 6, 9.2, 12.4, 15.6, 18.8]) {
            const x = side * wallX;
            orbArchitecture += orbPlane([[x, -1.8, z], [x, 3.2, z], [x, 3.2, z + 2.45], [x, -1.8, z + 2.45]]);
            for (const y of [-.8, .25, 1.3, 2.35]) orbArchitecture += orbLine([x, y, z + .18], [x, y, z + 2.25]);
            for (const depth of [.18, 1.2, 2.25]) orbArchitecture += orbLine([x, -1.8, z + depth], [x, 3.2, z + depth]);
          }
        }
        orbFrames = [5.5, 10.8, 16.1].map((z) => orbLine([-wallX, 4.7, z], [wallX, 4.7, z])).join('');
      } else if (scene.id === 'station') {
        for (const x of [-1.35, -.75, .75, 1.35]) orbArchitecture += orbLine([x, -1.96, 2], [x, -1.96, 26]);
        orbArchitecture += orbPlane([[-4.2, -2, 2], [-1.75, -2, 2], [-1.75, -2, 26], [-4.2, -2, 26]]) + orbPlane([[1.75, -2, 2], [4.2, -2, 2], [4.2, -2, 26], [1.75, -2, 26]]);
        for (const z of [3, 6.5, 10, 13.5, 17, 21]) {
          for (const side of [-1, 1]) orbArchitecture += orbLine([side * 3.7, -2, z], [side * 3.7, 4.7, z]) + orbLine([side * 3.7, 4.7, z], [side * 1.5, 5.6, z]);
          orbFrames += orbLine([-3.7, 4.7, z], [3.7, 4.7, z]);
        }
      } else {
        for (const side of [-1, 1]) {
          const x = side * wallX;
          for (const z of [3, 6.6, 10.2, 13.8, 17.4, 21]) {
            orbArchitecture += orbLine([x, -2, z], [x, 1.35, z]) + orbCurve([x, 1.35, z], [x, 3.7, z + 1.25], [x, 1.35, z + 2.5]) + orbLine([x, 1.35, z + 2.5], [x, -2, z + 2.5]);
          }
        }
        orbFrames = [5.8, 11.8, 17.8].map((z) => orbLine([-wallX, 4.9, z], [wallX, 4.9, z])).join('');
      }

      const orbSurfaces = orbPlane([[-wallX, -2, 2], [-wallX, 7, 2], [-wallX, 7, 26], [-wallX, -2, 26]]) + orbPlane([[wallX, -2, 2], [wallX, 7, 2], [wallX, 7, 26], [wallX, -2, 26]]);
      orbGrid.innerHTML = `<svg viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice" focusable="false"><g class="pyl-orb-grid__surfaces">${orbSurfaces}</g><g class="pyl-orb-grid__lines">${orbFloor}${orbWalls}</g><g class="pyl-orb-grid__architecture">${orbArchitecture}</g><g class="pyl-orb-grid__frames">${orbFrames}</g></svg>`;
      const orbStageGrid = document.querySelector('#pyl-orb-stage-grid');
      if (orbStageGrid) orbStageGrid.innerHTML = orbGrid.innerHTML;
      if (orbSceneLabel) orbSceneLabel.textContent = scene.label;
      const orbStageLabel = document.querySelector('#pyl-orb-stage-label');
      if (orbStageLabel) orbStageLabel.textContent = scene.label;
    };

    renderOrbScene();
    document.querySelectorAll('[data-orb-direction]').forEach((control) => {
      control.addEventListener('click', () => {
        orbGrid.classList.add('is-changing');
        orbSceneIndex = (orbSceneIndex + Number(control.dataset.orbDirection) + orbScenes.length) % orbScenes.length;
        window.setTimeout(() => {
          renderOrbScene();
          orbGrid.classList.remove('is-changing');
        }, 160);
      });
    });
  }

  const orbStage = document.querySelector('#pyl-orb-stage');
  const orbHotspot = document.querySelector('#pyl-orb-hotspot');
  const orbStageClose = document.querySelector('#pyl-orb-stage-close');
  const pylHero = document.querySelector('.pyl-page-hero');
  const orbShell = document.querySelector('.pyl-hero-orb');
  if (orbStage && orbHotspot && pylHero && orbShell) {
    let orbChatTimer = null;
    const layoutOrbStage = () => {
      const hero = pylHero.getBoundingClientRect();
      const orb = orbShell.getBoundingClientRect();
      const stageWidth = window.innerWidth;
      const stageHeight = Math.max(hero.bottom, 0);
      const originX = orb.left + orb.width / 2;
      const originY = orb.top + orb.height / 2;
      const maxR = Math.hypot(stageWidth, stageHeight) * 1.05;
      orbStage.style.setProperty('--pyl-stage-h', `${stageHeight.toFixed(0)}px`);
      orbStage.style.setProperty('--pyl-stage-x', `${originX.toFixed(0)}px`);
      orbStage.style.setProperty('--pyl-stage-y', `${originY.toFixed(0)}px`);
      orbStage.style.setProperty('--pyl-stage-r-open', `${maxR.toFixed(0)}px`);
    };
    const alignHeroToTop = () => {
      const hero = pylHero.getBoundingClientRect();
      if (hero.top >= 0) return;
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.max(0, window.scrollY + hero.top));
      root.style.scrollBehavior = previous;
    };
    const openOrbStage = () => {
      alignHeroToTop();
      layoutOrbStage();
      document.body.classList.add('pyl-stage-open');
      orbStage.setAttribute('aria-hidden', 'false');
      orbStage.classList.add('is-open');
      window.clearTimeout(orbChatTimer);
      orbChatTimer = window.setTimeout(() => {
        orbStage.classList.add('is-chat');
        startOrbChat();
        if (orbChatInput) orbChatInput.focus({ preventScroll: true });
      }, 820);
    };
    const closeOrbStage = () => {
      window.clearTimeout(orbChatTimer);
      orbStage.classList.remove('is-chat', 'is-open');
      orbStage.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pyl-stage-open');
      orbHotspot.focus({ preventScroll: true });
    };
    orbHotspot.addEventListener('click', openOrbStage);
    if (orbStageClose) orbStageClose.addEventListener('click', closeOrbStage);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && orbStage.classList.contains('is-open')) closeOrbStage();
    });
    window.addEventListener('resize', () => {
      if (!orbStage.classList.contains('is-open')) return;
      layoutOrbStage();
    });

    const pylKnowledge = {
      'Casa Gorordo Museum': {
        intro: 'a restored 19th-century heritage house and one of Cebu\u2019s best-preserved Spanish-colonial homes.',
        facts: [
          { keys: ['what', 'about', 'describe', 'history', 'historic', 'tell'], text: 'Casa Gorordo is a restored 19th-century "balay nga bato" (stone house) in Cebu City, and one of the finest surviving examples of a Cebuano colonial-era residence.' },
          { keys: ['built', 'year', 'old', 'when', 'century', '1850', 'construct'], text: 'It was built in the mid-1800s and later carefully restored, preserving its original structure and details.' },
          { keys: ['family', 'who', 'gorordo', 'bishop', 'lived', 'owned'], text: 'It was the home of the Gorordo family, including Juan B. Gorordo, the first Filipino bishop of Cebu.' },
          { keys: ['where', 'location', 'located', 'find', 'address', 'street'], text: 'It stands on Lopez Jaena Street in the old Parian district of Cebu City.' },
          { keys: ['architecture', 'material', 'coral', 'wood', 'design'], text: 'Its ground floor is built of coral stone and its upper floor of hardwood \u2014 a classic Cebuano colonial design that kept the lower level cool and sturdy.' },
          { keys: ['see', 'inside', 'collection', 'furniture', 'artifact', 'art', 'painting', 'exhibit', 'display'], text: 'Inside you can see period furniture, household and kitchen wares, religious images, and a gallery of Cebuano art and paintings.' },
          { keys: ['open', 'hours', 'visit', 'ticket', 'fee', 'entrance', 'time'], text: 'The museum is generally open to visitors from Tuesday to Sunday with a small entrance fee; it is worth checking current hours before you go.' }
        ]
      },
      'Cebu City Public Library': {
        intro: 'a free public library serving Cebu City, housed in a historic building in the city center.',
        facts: [
          { keys: ['what', 'about', 'describe', 'tell', 'history', 'historic'], text: 'The Cebu City Public Library is one of the oldest public libraries in the country, with roots going back to the early 20th century.' },
          { keys: ['where', 'location', 'located', 'find', 'building', 'address', 'rizal', 'osmena'], text: 'It is housed in the historic Rizal Memorial Library and Museum building along Osme\u00f1a Boulevard in Cebu City.' },
          { keys: ['collection', 'book', 'material', 'filipiniana', 'read', 'resource'], text: 'Its collection focuses on Filipiniana, Cebuano and local history, periodicals, and children\u2019s books.' },
          { keys: ['who', 'visit', 'free', 'member', 'student', 'researcher'], text: 'It is free and open to the public, with reading rooms used by students, researchers, and residents.' },
          { keys: ['service', 'offer', 'help', 'reference', 'children'], text: 'It offers reference services, a children\u2019s section, and local heritage materials about Cebu.' }
        ]
      },
      'Cebu Railway': {
        intro: 'the historic railway line that once connected Cebu City with towns to the north.',
        facts: [
          { keys: ['what', 'about', 'describe', 'tell', 'history', 'historic'], text: 'The Cebu railway was an early 20th-century line operated by the Philippine Railway Company, and it was the first railway on the island.' },
          { keys: ['route', 'where', 'connect', 'town', 'danao', 'north', 'mandaue', 'liloan', 'compostela'], text: 'It ran north from Cebu City through Mandaue, Consolacion, Liloan, and Compostela up to Danao.' },
          { keys: ['carry', 'freight', 'cargo', 'sugar', 'passenger', 'purpose', 'used'], text: 'It carried both passengers and freight, especially sugar and other agricultural produce from the northern towns.' },
          { keys: ['when', 'year', 'start', 'open', 'operate', '1910', 'close', 'stop', 'end'], text: 'It began operating in the 1910s and declined after the Second World War as road transport took over.' },
          { keys: ['today', 'now', 'modern', 'proposal', 'plan', 'transit', 'future'], text: 'The old right-of-way is remembered today in proposals for modern rail and transit lines for Cebu.' }
        ]
      },
      'Plaza Independencia': {
        intro: 'a historic public square in the heart of Cebu City.',
        facts: [
          { keys: ['what', 'about', 'describe', 'tell', 'history', 'historic'], text: 'Plaza Independencia began as the Plaza de Armas of the Spanish colonial period and was later renamed to mark Philippine independence.' },
          { keys: ['where', 'location', 'located', 'find', 'fort', 'port', 'pier'], text: 'It lies beside Fort San Pedro and near the Cebu City port area.' },
          { keys: ['see', 'monument', 'statue', 'legazpi', 'feature', 'fountain'], text: 'It features a monument to Miguel Lopez de Legazpi, fountains, and open green space.' },
          { keys: ['role', 'use', 'used', 'event', 'gather', 'parade'], text: 'The square has served as a parade ground, a public gathering place, and a venue for city events.' },
          { keys: ['today', 'now', 'visit', 'walk', 'park'], text: 'Today it is a landscaped public square popular for walks, gatherings, and city events.' }
        ]
      }
    };
    const pylPlaceKeywords = {
      'Casa Gorordo Museum': ['casa gorordo', 'gorordo', 'museum'],
      'Cebu City Public Library': ['public library', 'library'],
      'Cebu Railway': ['railway', 'railroad', 'train', 'station', 'rail', 'danao'],
      'Plaza Independencia': ['plaza independencia', 'independencia', 'plaza']
    };
    const orbChatLog = document.querySelector('#pyl-chat-log');
    const orbChatForm = document.querySelector('#pyl-chat-form');
    const orbChatInput = document.querySelector('#pyl-chat-input');
    const orbChatSuggestions = document.querySelector('#pyl-chat-suggestions');
    const orbChatHeading = document.querySelector('#pyl-chat-heading');

    const appendChatMessage = (text, role) => {
      if (!orbChatLog) return null;
      const message = document.createElement('div');
      message.className = `pyl-chat-msg pyl-chat-msg--${role}`;
      message.textContent = text;
      orbChatLog.appendChild(message);
      orbChatLog.scrollTop = orbChatLog.scrollHeight;
      return message;
    };
    const detectPlace = (question) => {
      for (const [name, keys] of Object.entries(pylPlaceKeywords)) {
        if (keys.some((key) => question.includes(key))) return name;
      }
      return null;
    };
    const buildPylAnswer = (question, activePlace) => {
      const q = question.toLowerCase();
      if (/^(hi|hello|hey|kumusta|good (morning|afternoon|evening))\b/.test(q)) {
        return `${activePlace} \u2014 ${pylKnowledge[activePlace].intro} What would you like to know about it?`;
      }
      const place = detectPlace(q) || activePlace;
      const knowledge = pylKnowledge[place];
      let best = null;
      let bestScore = 0;
      knowledge.facts.forEach((fact) => {
        const score = fact.keys.reduce((total, key) => total + (q.includes(key) ? 1 : 0), 0);
        if (score > bestScore) { bestScore = score; best = fact; }
      });
      if (best) return best.text;
      return `I don\u2019t have that detail in this Spatial\u2019s sample knowledge yet. For ${place} you can ask about its history, location, architecture, what to see, or visiting details.`;
    };
    const askPyl = (question) => {
      const text = question.trim();
      if (!text || !orbChatLog) return;
      if (orbChatHeading) orbChatHeading.style.display = 'none';
      appendChatMessage(text, 'user');
      const typing = document.createElement('div');
      typing.className = 'pyl-chat-msg pyl-chat-msg--typing';
      typing.innerHTML = '<span class="pyl-chat-dots"><i></i><i></i><i></i></span>';
      orbChatLog.appendChild(typing);
      orbChatLog.scrollTop = orbChatLog.scrollHeight;
      const label = document.querySelector('#pyl-orb-stage-label');
      const activePlace = (label && label.textContent) || 'Casa Gorordo Museum';
      window.setTimeout(() => {
        typing.classList.remove('pyl-chat-msg--typing');
        typing.classList.add('pyl-chat-msg--pyl');
        typing.textContent = buildPylAnswer(text, activePlace);
        orbChatLog.scrollTop = orbChatLog.scrollHeight;
      }, 620 + Math.random() * 520);
    };
    const startOrbChat = () => {
      if (!orbChatLog) return;
      orbChatLog.innerHTML = '';
      if (orbChatHeading) orbChatHeading.style.display = '';
      if (orbChatSuggestions) {
        orbChatSuggestions.innerHTML = '';
        ['What is this place?', 'Where is it located?', 'What can I see here?', 'How old is it?'].forEach((suggestion) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'pyl-chat-suggestion';
          button.textContent = suggestion;
          button.addEventListener('click', () => askPyl(suggestion));
          orbChatSuggestions.appendChild(button);
        });
      }
    };
    if (orbChatForm) {
      orbChatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (orbChatInput) {
          askPyl(orbChatInput.value);
          orbChatInput.value = '';
        }
      });
    }
  }

  const pylScrollCue = document.querySelector('#pyl-scroll-cue');
  if (pylScrollCue) {
    const updatePylScrollCue = () => pylScrollCue.classList.toggle('is-hidden', window.scrollY > 100);
    updatePylScrollCue();
    window.addEventListener('scroll', updatePylScrollCue, { passive: true });
  }

  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = 'public/favicon-32x32.png';
    document.head.appendChild(favicon);
  }
})();
