import * as THREE from './assets/vendor/three.module.js';
import { RoundedBoxGeometry } from './assets/vendor/RoundedBoxGeometry.js';
import { onScroll } from './assets/vendor/anime.esm.min.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const stage = document.querySelector('[data-webgl-stage]');
const canvas = document.querySelector('[data-webgl-canvas]');
const fallback = document.querySelector('[data-webgl-fallback]');
const sections = {
  services: document.querySelector('#services'),
  process: document.querySelector('#process'),
  founders: document.querySelector('#about'),
  main: document.querySelector('main')
};
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;
const smoothstep = value => value * value * (3 - 2 * value);

if (reduceMotion || !stage || !canvas || !sections.services || !sections.process || !sections.founders) {
  stage?.remove();
} else {
  let bounds = {};
  let targetScroll = 0;
  let renderScroll = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let lastFrameTime = performance.now();
  let dirty = true;
  let renderer;
  let scene;
  let camera;
  let wifi;
  let esc;
  let usingFallback = false;

  function updateBounds() {
    const pageY = scrollY;
    const top = element => element.getBoundingClientRect().top + pageY;
    bounds = {
      wifiStart: top(sections.services) - innerHeight * .72,
      wifiEnd: top(sections.process) + sections.process.offsetHeight * .1,
      escStart: top(sections.process) - innerHeight * .08,
      escEnd: top(sections.founders) - innerHeight * .12
    };
    dirty = true;
    requestRender();
  }

  function rangeProgress(scrollPosition, start, end) {
    return clamp((scrollPosition - start) / Math.max(end - start, 1));
  }

  function visibilityFor(progress) {
    return smoothstep(clamp(progress / .14)) * smoothstep(clamp((1 - progress) / .16));
  }

  function createArcShape(radius, width, start = .48, end = Math.PI - .48) {
    const shape = new THREE.Shape();
    const steps = 40;
    const outer = radius + width / 2;
    const inner = radius - width / 2;
    for (let index = 0; index <= steps; index += 1) {
      const angle = lerp(start, end, index / steps);
      const x = Math.cos(angle) * outer;
      const y = Math.sin(angle) * outer - 1.46;
      if (index === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    const endX = Math.cos(end) * radius;
    const endY = Math.sin(end) * radius - 1.46;
    for (let index = 1; index <= 8; index += 1) {
      const angle = end + Math.PI * index / 8;
      shape.lineTo(endX + Math.cos(angle) * width / 2, endY + Math.sin(angle) * width / 2);
    }
    for (let index = steps; index >= 0; index -= 1) {
      const angle = lerp(start, end, index / steps);
      shape.lineTo(Math.cos(angle) * inner, Math.sin(angle) * inner - 1.46);
    }
    const startX = Math.cos(start) * radius;
    const startY = Math.sin(start) * radius - 1.46;
    for (let index = 1; index <= 8; index += 1) {
      const angle = start + Math.PI + Math.PI * index / 8;
      shape.lineTo(startX + Math.cos(angle) * width / 2, startY + Math.sin(angle) * width / 2);
    }
    shape.closePath();
    return shape;
  }

  function createWifi() {
    const group = new THREE.Group();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf2f2ef, metalness: 1, roughness: .09, clearcoat: 1,
      clearcoatRoughness: .025, envMapIntensity: 1.85, transparent: true, opacity: 0
    });
    [1.16, 1.88, 2.68].forEach(radius => {
      const geometry = new THREE.ExtrudeGeometry(createArcShape(radius, .52), {
        depth: .56, bevelEnabled: true, bevelThickness: .2, bevelSize: .16,
        bevelSegments: 5, curveSegments: 32, steps: 1
      });
      geometry.translate(0, 0, -.28);
      group.add(new THREE.Mesh(geometry, material));
    });
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.39, 28, 18), material);
    dot.scale.z = .84;
    dot.position.set(0, -1.64, 0);
    group.add(dot);
    group.rotation.set(-.12, -.35, -.04);
    group.userData.materials = [material];
    return group;
  }

  function createEscTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    const context = textureCanvas.getContext('2d');
    context.clearRect(0, 0, 256, 256);
    context.fillStyle = '#f1f1ec';
    context.font = '500 68px Archivo, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('esc', 128, 132);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  function createEsc() {
    const group = new THREE.Group();
    const geometry = new RoundedBoxGeometry(2.72, 1.5, 2.72, 5, .3);
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const y = positions.getY(index);
      const taper = lerp(1, .79, clamp((y + .75) / 1.5));
      positions.setX(index, positions.getX(index) * taper);
      positions.setZ(index, positions.getZ(index) * taper);
    }
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x030303, metalness: .12, roughness: .065, clearcoat: 1,
      clearcoatRoughness: .018, transmission: .24, thickness: 1.25,
      ior: 1.48, envMapIntensity: 1.65, transparent: true, opacity: 0
    });
    group.add(new THREE.Mesh(geometry, material));
    const topGeometry = new RoundedBoxGeometry(2.22, .16, 2.22, 5, .24);
    const topMaterial = material.clone();
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = .735;
    group.add(top);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: createEscTexture(), transparent: true, opacity: 0, depthWrite: false
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.08, .68), labelMaterial);
    label.rotation.x = -Math.PI / 2;
    label.position.set(.16, .825, .08);
    group.add(label);
    group.rotation.set(.96, .16, .025);
    group.userData.materials = [material, topMaterial, labelMaterial];
    return group;
  }

  function setOpacity(object, opacity) {
    object.userData.materials.forEach(material => { material.opacity = opacity; });
    object.visible = opacity > .003;
  }

  function createStudioEnvironment() {
    const palettes = [
      ['#050505', '#ffffff', '#1b1b1b'], ['#020202', '#9b9b9b', '#ffffff'],
      ['#111111', '#ffffff', '#333333'], ['#000000', '#4f4f4f', '#f4f4f4'],
      ['#040404', '#4a100c', '#242424'], ['#050505', '#d8d8d2', '#0a0a0a']
    ];
    const faces = palettes.map((colors, index) => {
      const face = document.createElement('canvas');
      face.width = 128;
      face.height = 128;
      const context = face.getContext('2d');
      const gradient = context.createLinearGradient(index % 2 ? 128 : 0, 0, index % 2 ? 0 : 128, 128);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(.44, colors[1]);
      gradient.addColorStop(.58, colors[2]);
      gradient.addColorStop(1, '#020202');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
      return face;
    });
    const environment = new THREE.CubeTexture(faces);
    environment.colorSpace = THREE.SRGBColorSpace;
    environment.needsUpdate = true;
    return environment;
  }

  function viewportWorldSize() {
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
    return { height, width: height * camera.aspect };
  }

  function pathThrough(progress, start, middle, end) {
    if (progress <= .5) {
      return lerp(start, middle, smoothstep(clamp(progress * 2)));
    }
    return lerp(middle, end, smoothstep(clamp((progress - .5) * 2)));
  }

  function updateObjects(scrollPosition) {
    const wifiProgress = rangeProgress(scrollPosition, bounds.wifiStart, bounds.wifiEnd);
    const escProgress = rangeProgress(scrollPosition, bounds.escStart, bounds.escEnd);
    const size = viewportWorldSize();
    const mobile = innerWidth <= 600;
    const tablet = innerWidth > 600 && innerWidth <= 1024;
    const preset = mobile ? {
      wifiSize: .30, wifiXStart: .72, wifiXMid: .015, wifiXEnd: .72, wifiYStart: .34, wifiYEnd: .10, wifiYArc: -.035,
      escSize: .32, escXStart: .72, escXMid: .012, escXEnd: .06, escYStart: .18, escYEnd: .16, escYArc: -.16
    } : tablet ? {
      wifiSize: .205, wifiXStart: .64, wifiXMid: .012, wifiXEnd: .64, wifiYStart: .25, wifiYEnd: .04, wifiYArc: -.07,
      escSize: .225, escXStart: .64, escXMid: .01, escXEnd: .065, escYStart: -.06, escYEnd: .15, escYArc: -.09
    } : {
      wifiSize: .205, wifiXStart: .61, wifiXMid: .01, wifiXEnd: .61, wifiYStart: .27, wifiYEnd: .035, wifiYArc: -.07,
      escSize: .195, escXStart: .61, escXMid: .008, escXEnd: .055, escYStart: -.08, escYEnd: .14, escYArc: -.09
    };

    const wifiScale = (size.width * preset.wifiSize) / 5.65;
    const wifiArc = Math.sin(wifiProgress * Math.PI);
    const wifiX = pathThrough(wifiProgress, preset.wifiXStart, preset.wifiXMid, preset.wifiXEnd);
    const wifiY = lerp(preset.wifiYStart, preset.wifiYEnd, wifiProgress) + preset.wifiYArc * wifiArc;
    const wifiRotationLinear = clamp((wifiProgress - .055) / .945);
    const wifiRotationProgress = wifiRotationLinear * wifiRotationLinear;
    wifi.position.set(
      size.width * wifiX,
      size.height * wifiY, 0
    );
    wifi.rotation.x = -.08 + wifiRotationProgress * Math.PI * 2.35 + pointerY * .025;
    wifi.rotation.y = -.10 + wifiRotationProgress * Math.PI * .42 + pointerX * .025;
    wifi.rotation.z = -.035 * Math.PI + wifiRotationProgress * .07 * Math.PI;
    wifi.scale.setScalar(wifiScale * lerp(1, .7, clamp((wifiProgress - .8) / .2)));
    setOpacity(wifi, visibilityFor(wifiProgress));

    const escScale = (size.width * preset.escSize) / 2.72;
    const escArc = Math.sin(escProgress * Math.PI);
    const escX = pathThrough(escProgress, preset.escXStart, preset.escXMid, preset.escXEnd);
    const escY = lerp(preset.escYStart, preset.escYEnd, escProgress) + preset.escYArc * escArc;
    const escRotationProgress = clamp((escProgress - .05) / .95);
    esc.position.set(
      size.width * escX,
      size.height * escY, .15
    );
    esc.rotation.x = .96 + escRotationProgress * Math.PI * 1.18 + pointerY * .025;
    esc.rotation.y = .16 + escRotationProgress * Math.PI * .28 + pointerX * .025;
    esc.rotation.z = .025 + escRotationProgress * Math.PI * .055;
    const escEntrance = lerp(.68, 1, smoothstep(clamp(escProgress / .24)));
    const escExit = lerp(1, .68, smoothstep(clamp((escProgress - .8) / .2)));
    esc.scale.setScalar(escScale * escEntrance * escExit);
    setOpacity(esc, visibilityFor(escProgress));
  }

  function updateFallback(scrollPosition) {
    const wifiProgress = rangeProgress(scrollPosition, bounds.wifiStart, bounds.wifiEnd);
    const escProgress = rangeProgress(scrollPosition, bounds.escStart, bounds.escEnd);
    const wifiImage = fallback.querySelector('.webgl-fallback-wifi');
    const escImage = fallback.querySelector('.webgl-fallback-esc');
    const mobile = innerWidth <= 820;
    const position = (element, progress, opacity, isEsc) => {
      const arc = Math.sin(progress * Math.PI);
      const edge = mobile ? 72 : 62;
      const x = isEsc
        ? pathThrough(progress, edge, 0, 6)
        : pathThrough(progress, edge, 0, edge);
      const y = isEsc ? lerp(45, 34, arc) : lerp(58, 30, progress);
      element.style.opacity = opacity;
      element.style.transform = `translate(${x}vw, ${y - 50}vh) perspective(900px) rotateX(${progress * 390}deg) rotateY(${progress * 78}deg) scale(${mobile ? .4 : .25})`;
    };
    position(wifiImage, wifiProgress, visibilityFor(wifiProgress), false);
    position(escImage, escProgress, visibilityFor(escProgress), true);
  }

  function render(now = performance.now()) {
    frame = 0;
    if (document.hidden) return;
    const deltaTime = Math.min((now - lastFrameTime) / 1000, .1);
    lastFrameTime = now;
    const damping = 1 - Math.exp(-deltaTime * 5.4);
    renderScroll += (targetScroll - renderScroll) * damping;
    if (usingFallback) updateFallback(renderScroll);
    else {
      updateObjects(renderScroll);
      renderer.render(scene, camera);
    }
    const renderActive = renderScroll > bounds.wifiStart - innerHeight && renderScroll < bounds.escEnd + innerHeight;
    const targetActive = targetScroll > bounds.wifiStart - innerHeight && targetScroll < bounds.escEnd + innerHeight;
    const catchingUp = Math.abs(targetScroll - renderScroll) > .1;
    if ((renderActive || targetActive) && (catchingUp || dirty)) {
      dirty = false;
      frame = requestAnimationFrame(render);
    }
  }

  function requestRender(force = false) {
    if (force && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (!frame) {
      lastFrameTime = performance.now();
      frame = requestAnimationFrame(render);
    }
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene();
    scene.environment = createStudioEnvironment();
    camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, .1, 50);
    camera.position.z = 8;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x151515, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 5.2);
    key.position.set(-3, 5, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0xff3b30, 17, 18, 2);
    rim.position.set(5, -2, 4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xb7d6ff, 12, 16, 2);
    fill.position.set(-4, 1, 2);
    scene.add(fill);
    wifi = createWifi();
    esc = createEsc();
    scene.add(wifi, esc);
    stage.classList.add('is-ready');
  } catch (error) {
    usingFallback = true;
    canvas.hidden = true;
    fallback.hidden = false;
    stage.classList.add('is-ready', 'is-fallback');
    console.info('WebGL indisponível; fallback 2D ativado.', error);
  }

  updateBounds();
  const scrollControl = onScroll({
    target: sections.main,
    enter: 'top top',
    leave: 'bottom bottom',
    sync: .22,
    onUpdate: () => {
      targetScroll = scrollY;
      dirty = true;
      requestRender();
    }
  });
  targetScroll = scrollY;
  renderScroll = scrollY;
  requestRender();

  // Native scroll only updates the target. Bounds are recalculated on resize,
  // avoiding layout reads and rAF restarts on every scroll event.
  addEventListener('scroll', () => {
    targetScroll = scrollY;
    dirty = true;
    requestRender();
  }, { passive: true });

  if (finePointer) addEventListener('pointermove', event => {
    pointerX = (event.clientX / innerWidth - .5) * 2;
    pointerY = (event.clientY / innerHeight - .5) * 2;
    dirty = true;
    requestRender();
  }, { passive: true });

  addEventListener('resize', () => {
    updateBounds();
    if (!usingFallback) {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(innerWidth, innerHeight, false);
    }
    scrollControl.refresh();
    requestRender();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      targetScroll = scrollY;
      dirty = true;
      requestRender();
    }
  });
}
