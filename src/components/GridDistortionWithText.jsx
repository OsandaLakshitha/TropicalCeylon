import { useRef, useEffect, forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';

// Utility function to combine class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Rotating Text Component
const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: "-120%", opacity: 0 },
    rotationInterval = 3000,
    staggerDuration = 0.05,
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (splitBy === "characters") {
      const words = currentText.split(" ");
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }
    if (splitBy === "words") {
      return currentText.split(" ").map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index, totalChars) => {
      const total = totalChars;
      if (staggerFrom === "first") return index * staggerDuration;
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      return index * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      next,
    }),
    [next]
  );

  useEffect(() => {
    if (!auto) return;
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto]);

  // Simple animation without framer-motion for better compatibility
  return (
    <span
      className={cn(
        "flex flex-wrap whitespace-pre-wrap relative",
        mainClassName
      )}
      {...rest}
    >
      <span className="sr-only">{texts[currentTextIndex]}</span>
      <div
        key={currentTextIndex}
        className={cn(
          "flex flex-wrap whitespace-pre-wrap relative animate-fade-in"
        )}
        style={{
          animation: 'fadeInUp 0.8s ease-out forwards'
        }}
      >
        {elements.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array
            .slice(0, wordIndex)
            .reduce((sum, word) => sum + word.characters.length, 0);
          return (
            <span key={wordIndex} className={cn("inline-flex", splitLevelClassName)}>
              {wordObj.characters.map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={cn("inline-block transform transition-all duration-300", elementLevelClassName)}
                  style={{
                    animationDelay: `${getStaggerDelay(
                      previousCharsCount + charIndex,
                      array.reduce((sum, word) => sum + word.characters.length, 0)
                    )}s`,
                    animation: 'slideInUp 0.6s ease-out forwards'
                  }}
                >
                  {char}
                </span>
              ))}
              {wordObj.needsSpace && <span className="whitespace-pre"> </span>}
            </span>
          );
        })}
      </div>
    </span>
  );
});

RotatingText.displayName = "RotatingText";

// Fixed Grid Distortion Component
const GridDistortion = ({
  grid = 20,
  mouse = 0.2,
  strength = 0.1,
  relaxation = 0.92,
  imageSrc = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
  className = ''
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Import Three.js dynamically to avoid SSR issues
    const initThreeJS = async () => {
      const THREE = await import('three');
      
      const container = containerRef.current;
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      rendererRef.current = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
      camera.position.z = 1;

      // Vertex Shader
      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      // Fragment Shader
      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform sampler2D uDataTexture;
        uniform vec2 uResolution;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          vec4 offset = texture2D(uDataTexture, uv);
          vec2 distortedUV = uv + offset.rg * 0.05;
          vec4 color = texture2D(uTexture, distortedUV);
          gl_FragColor = color;
        }
      `;

      const uniforms = {
        uTexture: { value: null },
        uDataTexture: { value: null },
        uResolution: { value: new THREE.Vector2() }
      };

      // Load texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(imageSrc, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTexture.value = texture;
      });

      // Create data texture for distortion
      const size = grid;
      const data = new Float32Array(4 * size * size);
      
      for (let i = 0; i < size * size; i++) {
        data[i * 4] = 0; // R
        data[i * 4 + 1] = 0; // G
        data[i * 4 + 2] = 0; // B
        data[i * 4 + 3] = 1; // A
      }

      const dataTexture = new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      dataTexture.needsUpdate = true;
      uniforms.uDataTexture.value = dataTexture;

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const mouseState = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };

      const handleResize = () => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        renderer.setSize(width, height);
        uniforms.uResolution.value.set(width, height);
        
        // Maintain aspect ratio
        const aspect = width / height;
        if (aspect > 1) {
          plane.scale.set(aspect, 1, 1);
        } else {
          plane.scale.set(1, 1/aspect, 1);
        }
      };

      const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        
        mouseState.vX = (x - mouseState.prevX) * 10;
        mouseState.vY = (y - mouseState.prevY) * 10;
        mouseState.x = x;
        mouseState.y = y;
        mouseState.prevX = x;
        mouseState.prevY = y;
      };

      const handleMouseLeave = () => {
        mouseState.vX = 0;
        mouseState.vY = 0;
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('resize', handleResize);
      handleResize();

      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Update distortion data
        const data = dataTexture.image.data;
        
        // Apply relaxation
        for (let i = 0; i < size * size; i++) {
          data[i * 4] *= relaxation;
          data[i * 4 + 1] *= relaxation;
        }

        // Add mouse influence
        const gridMouseX = Math.floor(size * mouseState.x);
        const gridMouseY = Math.floor(size * mouseState.y);
        const maxDist = size * mouse;

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const distance = Math.sqrt(
              Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2)
            );
            
            if (distance < maxDist) {
              const index = i + size * j;
              const power = 1 - (distance / maxDist);
              
              data[index * 4] += strength * mouseState.vX * power;
              data[index * 4 + 1] += strength * mouseState.vY * power;
            }
          }
        }

        dataTexture.needsUpdate = true;
        renderer.render(scene, camera);
      };

      animate();

      // Cleanup function
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
        
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
        }
        
        if (renderer && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        
        // Dispose of Three.js objects
        geometry?.dispose();
        material?.dispose();
        dataTexture?.dispose();
        uniforms.uTexture.value?.dispose();
        renderer?.dispose();
      };
    };

    let cleanup;
    initThreeJS().then((cleanupFn) => {
      cleanup = cleanupFn;
    }).catch(console.error);

    return () => {
      if (cleanup) cleanup();
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};

// Main Component combining both
const GridDistortionWithText = () => {
  const rotatingTexts = [
    "Discover Paradise",
    "Explore Sri Lanka", 
    "Island Dreams",
    "Ceylon Wonders"
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-teal-800 to-emerald-700">
      {/* Grid Distortion Background */}
      <div className="absolute inset-0 opacity-80">
        <GridDistortion
          grid={25}
          mouse={0.15}
          strength={0.08}
          relaxation={0.95}
          imageSrc="./assets/background.jpg"
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      
      {/* Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        
        {/* Centered Rotating Text */}
        <div className="mb-8">
          <RotatingText
            texts={rotatingTexts}
            mainClassName="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
            elementLevelClassName="hover:text-emerald-300 transition-colors duration-300"
            rotationInterval={3000}
            staggerDuration={0.1}
            splitBy="characters"
          />
        </div>

        {/* Supporting Paragraph */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 font-light tracking-wide">
          Step into a world where time slows down, and every moment is touched by tropical magic.
          <span className="block sm:inline"> Island Dreams captures the essence of Sri Lanka’s serene coastal beauty, lush landscapes, and warm island culture.</span>
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white/20 text-white border border-white/30 rounded-full font-medium backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            Explore Now
          </button>
          <button className="px-8 py-4 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Book Your Journey
          </button>
        </div>
      </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default GridDistortionWithText;