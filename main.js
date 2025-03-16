/**
 * HEBELE HUB - Main JavaScript File
 * Modern etkileşimler ve animasyonlar için temel JS
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('HEBELE HUB: Main JS loaded ✅');

  // Swiper hazır olduğunu kontrol et
  if (typeof Swiper === 'undefined') {
    console.error('Swiper is not loaded! Attempting to load it dynamically...');
    
    // Swiper dinamik olarak yükle
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.onload = function() {
      console.log('Swiper loaded dynamically, initializing...');
      // Tüm JS işlevlerini çağır
      initAll();
    };
    document.head.appendChild(swiperScript);
  } else {
    console.log('Swiper is loaded, version:', Swiper.version);
    // Tüm JS işlevlerini çağır
    initAll();
  }
  
  // Tüm başlatma işlevlerini çağırır
  function initAll() {
    initParticles();
    initSliders();
    initMobileMenu();
    initPopup();
    initCounters();
    initGlowButtons();
    initLazyLoad();
    initVanillaTilt();
    initAOS();
    initScrollEffects();
    initStickyHeader();
    
    // GSAP animasyonlarını başlat
    if (typeof gsap !== 'undefined') {
      initGSAPAnimations();
    }
  }
});

// Particles.js arka plan efektini başlat
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    try {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#3ebcfa' },
          shape: {
            type: 'circle',
            stroke: { width: 0, color: '#000000' },
            polygon: { nb_sides: 5 }
          },
          opacity: {
            value: 0.2,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#3ebcfa',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
      console.log('Particles.js initialized 🎊');
    } catch (error) {
      console.warn('Particles.js error:', error);
    }
  }
}

// Tüm sliderları başlat
// initSliders fonksiyonunu düzelten kod:
function initSliders() {
  try {
    console.log('Initializing sliders...');
    
    // Ana Slider (Hero Bölümü - Masaüstü)
    const desktopSlider = document.querySelector('.desktop-slider');
    if (desktopSlider) {
      console.log('Desktop slider found, initializing...');
      
      // Swiper'ı başlat
      const desktopSwiperInstance = new Swiper(desktopSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        loopAdditionalSlides: 3,
        loopPreventsSlide: false,
        
        // Fade efekti için
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        
        // RESİM DEĞİŞİM SÜRESİ: Aşağıdaki değeri değiştirerek otomatik değişim süresini ayarlayabilirsiniz (ms cinsinden)
        autoplay: {
          delay: 5000, // 5 saniye (5000ms) - İsterseniz bu süreyi değiştirebilirsiniz
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        
        speed: 800, // Geçiş hızı (ms)
        
        // Pagination ayarları
        pagination: {
          el: '.desktop-slider .swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        
        // Navigasyon ayarları
        navigation: {
          nextEl: '.desktop-slider .swiper-button-next',
          prevEl: '.desktop-slider .swiper-button-prev',
        },
        
        // Dokunmatik ve kaydırma iyileştirmeleri
        grabCursor: true,
        touchEventsTarget: 'wrapper',
        touchRatio: 1,
        touchAngle: 45,
        touchStartPreventDefault: false,
        passiveListeners: true,
        resistance: false,
        
        // Önemli: Gözlemci ve diğer performans iyileştirmeleri
        observer: true,
        observeParents: true,
        watchOverflow: true,
        preloadImages: true,
        updateOnImagesReady: true,
        watchSlidesProgress: true,
        resizeObserver: true,
        preventInteractionOnTransition: false,
        roundLengths: true
      });
      
      // Kaydırma tamamlandıktan sonra görünürlük kontrolü
      desktopSwiperInstance.on('slideChangeTransitionEnd', function() {
        // Tüm slide'ların görünür olduğundan emin ol
        desktopSwiperInstance.slides.forEach(slide => {
          slide.style.display = 'block';
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
        });
      });
      
      console.log('Desktop slider initialized successfully ✓');
    }
    
    // Mobil Slider
    const mobileSlider = document.querySelector('.mobile-slider');
    if (mobileSlider) {
      console.log('Mobile slider found, initializing...');
      
      const mobileSwiperInstance = new Swiper(mobileSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        loopAdditionalSlides: 3,
        
        effect: 'fade',
        fadeEffect: { crossFade: true },
        
        // RESİM DEĞİŞİM SÜRESİ: Aşağıdaki değeri değiştirerek otomatik değişim süresini ayarlayabilirsiniz (ms cinsinden)
        autoplay: {
          delay: 5000, // 5 saniye (5000ms) - İsterseniz bu süreyi değiştirebilirsiniz
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        
        speed: 800, // Geçiş hızı (ms)
        
        pagination: {
          el: '.mobile-slider .swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        
        // Dokunmatik ve kaydırma iyileştirmeleri
        grabCursor: true,
        touchEventsTarget: 'wrapper',
        touchRatio: 1,
        touchAngle: 45,
        
        // Önemli: Gözlemci ve diğer performans iyileştirmeleri
        observer: true,
        observeParents: true,
        watchOverflow: true,
        preloadImages: true,
        updateOnImagesReady: true,
        watchSlidesProgress: true,
        resizeObserver: true,
        roundLengths: true
      });
      
      // Kaydırma tamamlandıktan sonra görünürlük kontrolü
      mobileSwiperInstance.on('slideChangeTransitionEnd', function() {
        mobileSwiperInstance.slides.forEach(slide => {
          slide.style.display = 'block';
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
        });
      });
      
      console.log('Mobile slider initialized successfully ✓');
    }
    
    console.log('All sliders initialized successfully! 🚀');
  } catch (error) {
    console.error('Swiper initialization error:', error);
  }
}

// Mobil menü işlemleri
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      
      // Buton içeriğini değiştir (hamburger <-> X)
      const isExpanded = mainNav.classList.contains('active');
      navToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Dışarı tıklandığında menüyü kapat
    document.addEventListener('click', function(event) {
      const isClickInside = navToggle.contains(event.target) || mainNav.contains(event.target);
      
      if (!isClickInside && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
    
    console.log('Mobile menu initialized 📲');
  }
}

// Popup/Modal işlemleri
function initPopup() {
  const popup = document.getElementById('welcomePopup');
  
  if (popup) {
    // LocalStorage'da bu popup'ın gösterilip gösterilmeyeceğini kontrol et
    const dontShow = localStorage.getItem('dontShowWelcomePopup');
    
    if (!dontShow) {
      // Popup'ı göster (sayfa yüklendikten biraz sonra)
      setTimeout(() => {
        popup.classList.add('active');
      }, 1500);
      
      // Kapatma butonu işlemi
      const closeBtn = popup.querySelector('.popup-close');
      const actionBtn = popup.querySelector('.popup-button');
      const checkbox = popup.querySelector('#dontShowAgain');
      
      const closePopup = () => {
        popup.classList.remove('active');
        
        // Checkbox işaretliyse, popup'ı bir daha gösterme
        if (checkbox && checkbox.checked) {
          localStorage.setItem('dontShowWelcomePopup', 'true');
        }
      };
      
      if (closeBtn) closeBtn.addEventListener('click', closePopup);
      if (actionBtn) actionBtn.addEventListener('click', closePopup);
      
      // ESC tuşu ile kapatma
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popup.classList.contains('active')) {
          closePopup();
        }
      });
      
      // Popup dışına tıklayarak kapatma
      popup.addEventListener('click', function(event) {
        if (event.target === popup) {
          closePopup();
        }
      });
      
      console.log('Popup initialized 💬');
    }
  }
}

// Sayaç animasyonları
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0) {
    // IntersectionObserver ile görünürlüğü tespit et
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target') || counter.textContent.replace(/,/g, ''));
          const duration = 2000; // ms cinsinden animasyon süresi
          const fps = 60;
          const frameDuration = 1000 / fps;
          const totalFrames = duration / frameDuration;
          const increment = target / totalFrames;
          
          let currentCount = 0;
          const updateCounter = () => {
            currentCount += increment;
            if (currentCount < target) {
              counter.textContent = Math.floor(currentCount).toLocaleString();
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };
          
          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.1 });
    
    counters.forEach(counter => {
      observer.observe(counter);
    });
    
    console.log('Counters initialized 🔢');
  }
}

// Glow butonlar için fare takibi
function initGlowButtons() {
  const glowButtons = document.querySelectorAll('.btn-glow, .glow-button');
  
  glowButtons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      button.style.setProperty('--x', x + 'px');
      button.style.setProperty('--y', y + 'px');
    });
  });
  
  console.log('Glow buttons initialized ✨');
}

// Lazy loading görsel optimizasyonu
function initLazyLoad() {
  // Native lazy loading kullan (destekleyen tarayıcılar için)
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // IntersectionObserver ile manuel lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.add('loaded');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
      
      lazyImages.forEach(lazyImage => {
        lazyImageObserver.observe(lazyImage);
      });
    }
  }
  
  console.log('Lazy loading initialized 🖼️');
}

// VanillaTilt.js ile 3D kart efekti
function initVanillaTilt() {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 10,
      speed: 400,
      scale: 1.05,
      glare: true,
      'max-glare': 0.3,
      gyroscope: true
    });
    
    console.log('VanillaTilt initialized 🔄');
  }
}

// AOS (Animate On Scroll) başlat
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: false,
      mirror: true,
      offset: 50
    });
    
    // Pencere boyutu değiştiğinde AOS'u yenile
    window.addEventListener('resize', function() {
      AOS.refresh();
    });
    
    console.log('AOS initialized 📜');
  }
}

// Scroll efektleri
function initScrollEffects() {
  // Parallax efekti
  const parallaxItems = document.querySelectorAll('.parallax');
  
  if (parallaxItems.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      parallaxItems.forEach(item => {
        const speed = item.dataset.speed || 0.1;
        item.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }
  
  console.log('Scroll effects initialized 📜');
}

// GSAP animasyonları
function initGSAPAnimations() {
  // Hero başlık animasyonu
  if (document.querySelector('.hero-title-mobile')) {
    gsap.from('.hero-title-mobile h1', { 
      duration: 1.2, 
      y: 50, 
      opacity: 0, 
      ease: 'power3.out',
      delay: 0.3
    });
    
    gsap.from('.hero-subtitle', { 
      duration: 1.2, 
      y: 30, 
      opacity: 0, 
      ease: 'power3.out',
      delay: 0.5
    });
  }
  
  // Hero butonları animasyonu
  if (document.querySelector('.hero-cta')) {
    gsap.from('.hero-cta .btn', { 
      duration: 1, 
      y: 20, 
      opacity: 0, 
      stagger: 0.2,
      ease: 'power2.out',
      delay: 0.7
    });
  }
  
  // Hero özellikleri animasyonu
  if (document.querySelector('.hero-features')) {
    gsap.from('.hero-feature', { 
      duration: 1, 
      y: 30, 
      opacity: 0, 
      stagger: 0.15,
      ease: 'power2.out',
      delay: 1
    });
  }
  
  console.log('GSAP animations initialized 🎬');
}

// Yapışkan üst menü
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  
  if (header) {
    const sticky = header.offsetTop + 50;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > sticky) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    console.log('Sticky header initialized 📌');
  }
}

// Sayfa yüklendiğinde Swiper denetimini yap
window.addEventListener('load', function() {
  // Swiper butonlarının düzgün çalıştığını kontrol et
  setTimeout(() => {
    const desktopSlider = document.querySelector('.desktop-slider');
    if (desktopSlider) {
      const nextBtn = desktopSlider.querySelector('.swiper-button-next');
      const prevBtn = desktopSlider.querySelector('.swiper-button-prev');
      
      if (nextBtn && prevBtn) {
        // z-index sorunlarını çözmek için
        nextBtn.style.zIndex = "100";
        prevBtn.style.zIndex = "100";
        console.log('Slider navigation buttons fixed.');
      }
    }
  }, 500);
  
  // 60 saniyede bir slider kontrolü
  setInterval(() => {
    const desktopSwiperElement = document.querySelector('.desktop-slider');
    const mobileSwiperElement = document.querySelector('.mobile-slider');
    
    if (desktopSwiperElement && desktopSwiperElement.swiper) {
      console.log('Performing routine slider maintenance...');
      desktopSwiperElement.swiper.update();
    }
    
    if (mobileSwiperElement && mobileSwiperElement.swiper) {
      mobileSwiperElement.swiper.update();
    }
  }, 60000);
});
