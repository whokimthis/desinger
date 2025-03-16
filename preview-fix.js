/**
 * Preview modu için özel düzeltmeler
 * Bu dosya, CSS ve JS dosyalarının doğru yüklendiğinden emin olur
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Preview Fix: Loading essential dependencies...');
  
  // CSS dosyalarını kontrol et
  function checkAndFixCSS() {
    // Global CSS referansını kontrol et
    const hasCssReference = Array.from(document.styleSheets).some(sheet => {
      if (!sheet.href) return false;
      return sheet.href.includes('global.css');
    });
    
    if (!hasCssReference) {
      console.warn('Preview Fix: global.css not found, adding it manually...');
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = '/src/styles/global.css';
      document.head.appendChild(cssLink);
    }
    
    // Responsive CSS dosyalarını kontrol et
    const hasResponsiveCSS = Array.from(document.styleSheets).some(sheet => {
      if (!sheet.href) return false;
      return sheet.href.includes('responsive-custom.css');
    });
    
    if (!hasResponsiveCSS) {
      console.warn('Preview Fix: responsive-custom.css not found, adding it manually...');
      const responsiveLink = document.createElement('link');
      responsiveLink.rel = 'stylesheet';
      responsiveLink.href = '/css/responsive-custom.css';
      document.head.appendChild(responsiveLink);
    }
  }
  
  // JS kütüphanelerini kontrol et
  function checkAndFixJS() {
    // Font Awesome kontrolü
    if (typeof FontAwesome === 'undefined') {
      console.warn('Preview Fix: FontAwesome not found, adding it manually...');
      const faScript = document.createElement('script');
      faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
      document.head.appendChild(faScript);
    }
    
    // Swiper kontrolü
    if (typeof Swiper === 'undefined') {
      console.warn('Preview Fix: Swiper not found, adding it manually...');
      const swiperLink = document.createElement('link');
      swiperLink.rel = 'stylesheet';
      swiperLink.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(swiperLink);
      
      const swiperScript = document.createElement('script');
      swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      document.head.appendChild(swiperScript);
    }
    
    // GSAP kontrolü
    if (typeof gsap === 'undefined') {
      console.warn('Preview Fix: GSAP not found, adding it manually...');
      const gsapScript = document.createElement('script');
      gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';
      document.head.appendChild(gsapScript);
    }
    
    // AOS kontrolü
    if (typeof AOS === 'undefined') {
      console.warn('Preview Fix: AOS not found, adding it manually...');
      const aosLink = document.createElement('link');
      aosLink.rel = 'stylesheet';
      aosLink.href = 'https://unpkg.com/aos@next/dist/aos.css';
      document.head.appendChild(aosLink);
      
      const aosScript = document.createElement('script');
      aosScript.src = 'https://unpkg.com/aos@next/dist/aos.js';
      document.head.appendChild(aosScript);
      
      aosScript.onload = function() {
        if (typeof AOS !== 'undefined') {
          AOS.init();
        }
      };
    }
    
    // Vanilla Tilt kontrolü
    if (typeof VanillaTilt === 'undefined') {
      console.warn('Preview Fix: VanillaTilt not found, adding it manually...');
      const tiltScript = document.createElement('script');
      tiltScript.src = 'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js';
      document.head.appendChild(tiltScript);
    }
    
    // Particles.js kontrolü
    if (typeof particlesJS === 'undefined') {
      console.warn('Preview Fix: Particles.js not found, adding it manually...');
      const particlesScript = document.createElement('script');
      particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      document.head.appendChild(particlesScript);
    }
  }
  
  // CSS ve JS'i kontrol et ve düzelt
  checkAndFixCSS();
  checkAndFixJS();
  
  // main.js işlemlerini çağır (initAll gibi)
  setTimeout(function() {
    if (typeof initAll === 'function') {
      console.log('Preview Fix: Calling initAll() function...');
      initAll();
    } else if (window.initAll) {
      console.log('Preview Fix: Calling window.initAll() function...');
      window.initAll();
    } else {
      console.warn('Preview Fix: initAll() function not found, trying to initialize components individually...');
      
      // Bireysel fonksiyonları çağırmayı dene
      ['initParticles', 'initSliders', 'initMobileMenu', 'initPopup', 
       'initCounters', 'initGlowButtons', 'initLazyLoad', 'initVanillaTilt', 
       'initAOS', 'initScrollEffects', 'initStickyHeader', 'initGSAPAnimations'].forEach(fn => {
        if (typeof window[fn] === 'function') {
          console.log(`Preview Fix: Calling ${fn}() function...`);
          window[fn]();
        }
      });
    }
  }, 1000);
});