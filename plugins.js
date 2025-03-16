/**
 * Sakultah Tema - Eklentiler
 * 
 * AOS - Animate On Scroll kütüphanesi
 * Vanilla-Tilt - Modern 3D kart efektleri
 * Rellax - Parallax efektleri
 * Swiper init - Özel ayarlar
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Plugins JS yüklendi');

  // AOS Animate on Scroll kütüphanesini başlat
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false
    });
    console.log('AOS başlatıldı');
  }

  // VanillaTilt - 3D kart efektleri
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
    });
    console.log('VanillaTilt başlatıldı');
  }

  // Rellax - Parallax efektleri
  if (typeof Rellax !== 'undefined') {
    var rellax = new Rellax('.rellax', {
      speed: -2,
      center: true,
      wrapper: null,
      round: true,
      vertical: true,
      horizontal: false
    });
    console.log('Rellax başlatıldı');
  }

  // Particles.js arka plan
  initParticles();

  // Masaüstünde göreseller için lazyload
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
});

// Particles.js arka plan
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#3ebcfa"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.3,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#3ebcfa",
          "opacity": 0.2,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    console.log('Particles.js başlatıldı');
  }
}