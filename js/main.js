(function() {
    var current = 0;
    var total = 4;
    var autoTimer = null;
    var AUTO_INTERVAL = 5000; // 5 seconds per slide
 
    function updateCarousel() {
      // Slides
      var slides = document.querySelectorAll('.slide');
      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === current);
        s.classList.toggle('prev-slide', i === (current - 1 + total) % total);
      });
 
      // Dots
      var dots = document.querySelectorAll('.dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
 
      // Progress bar reset
      var bar = document.getElementById('progressBar');
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        setTimeout(function () {
          bar.style.transition = 'width ' + AUTO_INTERVAL + 'ms linear';
          bar.style.width = '100%';
        }, 50);
      }
    }
 
    window.changeSlide = function (dir) {
      current = (current + dir + total) % total;
      updateCarousel();
      resetAuto();
    };
 
    window.goToSlide = function (index) {
      current = index;
      updateCarousel();
      resetAuto();
    };
 
    function autoPlay() {
      current = (current + 1) % total;
      updateCarousel();
    }
 
    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(autoPlay, AUTO_INTERVAL);
    }
 
    // Mobile menu toggle
    window.toggleMobileMenu = function () {
      var menu = document.getElementById('mobileMenu');
      var ham = document.getElementById('hamburger');
      menu.classList.toggle('open');
      ham.classList.toggle('open');
    };
 
    // Quote form submission
    window.submitQuote = function () {
      var name = document.getElementById('firstName').value;
      var phone = document.getElementById('phone').value;
      var service = document.getElementById('service').value;
      if (!name || !phone || !service) {
        alert('Please fill in your name, phone number and service before submitting.');
        return;
      }
      alert('Thank you, ' + name + '! Your quote request has been submitted. We will contact you shortly.');
    };
 
    // Navbar shadow on scroll
    window.addEventListener('scroll', function () {
      var nb = document.getElementById('mainNavbar');
      if (nb) {
        nb.classList.toggle('scrolled', window.scrollY > 10);
      }
    });
 
    // Touch / swipe support
    var startX = 0;
    var track = document.getElementById('carouselTrack');
    if (track) {
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      track.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
      }, { passive: true });
    }
 
    // Init
    updateCarousel();
    autoTimer = setInterval(autoPlay, AUTO_INTERVAL);
  })();

// FAQ toggle
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}


(function(){
  var trackEl = document.getElementById('tTrack');
  if (!trackEl) return;
  var cur=0,total=4,timer;
  function update(){
    trackEl.style.transform='translateX(-'+cur*100+'%)';
    document.getElementById('tCur').textContent=cur+1;
    document.querySelectorAll('.t-prog-dot').forEach(function(d,i){
      d.classList.toggle('active',i===cur);
    });
  }
  window.tMove=function(d){cur=(cur+d+total)%total;update();reset()};
  window.tGo=function(i){cur=i;update();reset()};
  function reset(){clearInterval(timer);timer=setInterval(function(){cur=(cur+1)%total;update()},6000)}
  update();reset();
})();


// Gallery filter and before-after slider (vanilla JS — runs on any page)
(function(){
  document.querySelectorAll('.gallery-filter-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.gallery-filter-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.ba-reveal').forEach(function(reveal){
    var isDragging = false;

    function setPos(pct){
      pct = Math.max(5, Math.min(95, pct));
      // clip-path (not width) keeps .ba-before-wrap full-size so the image
      // inside it never stretches as the reveal fraction changes.
      reveal.querySelector('.ba-before-wrap').style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      reveal.querySelector('.ba-divider').style.left = pct + '%';
      reveal.querySelector('.ba-handle').style.left = pct + '%';
    }

    function getPercent(e, touch){
      var rect = reveal.getBoundingClientRect();
      var clientX = touch ? e.touches[0].clientX : e.clientX;
      return ((clientX - rect.left) / rect.width) * 100;
    }

    reveal.addEventListener('mousedown', function(e){ isDragging=true; setPos(getPercent(e,false)); e.preventDefault(); });
    window.addEventListener('mousemove', function(e){ if(isDragging) setPos(getPercent(e,false)); });
    window.addEventListener('mouseup', function(){ isDragging=false; });

    reveal.addEventListener('touchstart', function(e){ isDragging=true; setPos(getPercent(e,true)); },{passive:true});
    reveal.addEventListener('touchmove', function(e){ if(isDragging) setPos(getPercent(e,true)); },{passive:true});
    reveal.addEventListener('touchend', function(){ isDragging=false; });

    // Intro animation
    var pct=80;
    var interval=setInterval(function(){
      pct-=1.5; setPos(pct);
      if(pct<=50) clearInterval(interval);
    },16);
  });
})();


// jQuery-dependent code for back-to-top fade, dropdown hover, and
// portfolio isotope/owlCarousel — only present on the legacy Bootstrap
// pages (service/portfolio/contact/single) that still load jQuery.
// Guarded so it never runs (and never throws) on the vanilla pages
// (index.html, about.html), which don't load jQuery.
if (window.jQuery) {
  (function ($) {
    "use strict";

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });

  })(jQuery);
}


window.addEventListener('scroll', function(){
  var btn = document.getElementById('backToTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 300);
});


// Contact form submission (no backend wired up yet — see the HTML comment
// above the form in contact.html). Mirrors the homepage quote form's
// placeholder pattern: prevent the real navigation to action="#" and just
// confirm client-side instead.
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cf-name');
    var label = name && name.value ? ', ' + name.value : '';
    alert('Thank you' + label + '! Your message has been received. We will get back to you shortly.');
    form.reset();
  });
})();


// Scroll-reveal fade-up animation for section headings, cards and stat blocks
(function(){
  var targets = document.querySelectorAll(
    '.about-title, .ah-title, .track-record-title, .why-choose-title, ' +
    '.service-title, .faqs-title, .t-heading, .gallery-title, .locations-title, ' +
    '.contact-hero-title, .track-card, .why-card, .service-card, .location-card, .ba-card, ' +
    '.contact-quick-link, .contact-form-wrap, ' +
    '.stat-item, .ah-stat, .point-item'
  );
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();

