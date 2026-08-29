/* ============================================================
   TEJAAS TAMILSELVAN — PORTFOLIO INTERACTIONS
   1. Hero statement — word-by-word blur reveal on load
   2. Project cards — staggered scroll reveal (IntersectionObserver)
   3. Project media — subtle pointer-driven tilt (desktop only)
   All effects are skipped for prefers-reduced-motion.
   ============================================================ */

(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- 1. Hero word-by-word reveal ---------- */
  function initHeroReveal(){
    var el = document.querySelector("[data-reveal-text]");
    if(!el) return;

    var text = el.textContent.trim();
    var words = text.split(/\s+/);

    if(reduceMotion){
      return; // leave plain text, CSS already shows it fully opaque
    }

    el.innerHTML = words.map(function(word, i){
      var delay = 40 + i * 22; // ms, gentle cascade
      return '<span class="word" style="animation-delay:' + delay + 'ms">' + word + '</span>';
    }).join(" ");
  }

  /* ---------- 2. Scroll reveal for project cards ---------- */
  function initScrollReveal(){
    var items = document.querySelectorAll(".reveal");
    if(!items.length) return;

    if(reduceMotion || !("IntersectionObserver" in window)){
      items.forEach(function(el){ el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function(el){ observer.observe(el); });
  }

  /* ---------- 3. Pointer tilt on project media ---------- */
  function initTilt(){
    if(!canHover || reduceMotion) return;

    var cards = document.querySelectorAll("[data-tilt] .project__media");

    cards.forEach(function(card){
      var bounds;
      var raf = null;

      function onMove(e){
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function(){
          bounds = bounds || card.getBoundingClientRect();
          var x = (e.clientX - bounds.left) / bounds.width - 0.5;
          var y = (e.clientY - bounds.top) / bounds.height - 0.5;

          var rotateX = (y * -4).toFixed(2);
          var rotateY = (x * 4).toFixed(2);

          card.style.transform =
            "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.008)";
        });
      }

      function onEnter(){
        bounds = card.getBoundingClientRect();
        card.style.transition = "transform 120ms ease-out";
      }

      function onLeave(){
        card.style.transition = "transform 420ms cubic-bezier(.16,1,.3,1)";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        bounds = null;
      }

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    initHeroReveal();
    initScrollReveal();
    initTilt();
  });

})();