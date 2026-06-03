// ==========================================
// FIREBASE
// ==========================================

import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("Firebase conectado:", db);


// ==========================================
// LOADING SCREEN
// ==========================================

const loader = document.createElement("div");

loader.classList.add("loader-screen");

loader.innerHTML = `

<div class="loader-logo">

  <div class="loader-circle"></div>

  <h1>ZYQEN</h1>

</div>

`;

document.body.appendChild(loader);

window.addEventListener("load", () => {

  setTimeout(() => {

    loader.style.opacity = "0";

    loader.style.pointerEvents = "none";

    loader.style.transform = "scale(1.08)";

    setTimeout(() => {

      loader.remove();

    }, 1000);

  }, 1400);

});


// ==========================================
// STYLE LOADER
// ==========================================

const loaderStyle = document.createElement("style");

loaderStyle.innerHTML = `

.loader-screen{

  position:fixed;

  inset:0;

  background:#05010d;

  display:flex;

  align-items:center;

  justify-content:center;

  z-index:999999;

  transition:1s ease;

}

.loader-logo{

  text-align:center;

}

.loader-logo h1{

  margin-top:22px;

  color:white;

  font-size:42px;

  letter-spacing:8px;

  text-shadow:
  0 0 25px rgba(168,85,255,.4);

}

.loader-circle{

  width:120px;

  height:120px;

  border-radius:50%;

  border:3px solid rgba(168,85,255,.15);

  border-top:3px solid #a855ff;

  animation:spin 1s linear infinite;

  box-shadow:
  0 0 45px rgba(168,85,255,.45);

}

@keyframes spin{

  to{

    transform:rotate(360deg);

  }

}

`;

document.head.appendChild(loaderStyle);


// ==========================================
// FIREBASE PRODUCTS
// ==========================================

async function loadProducts() {

  const productsContainer =
  document.querySelector(".products");

  productsContainer.innerHTML = "";

  try {

    const querySnapshot =
    await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc, index) => {

      const product = doc.data();

      if(product.active !== true) return;

      const card = document.createElement("a");

      card.classList.add("card");

      card.href = product.link;

      card.target = "_blank";

      card.style.opacity = "0";

      card.style.transform =
      "translateY(45px) scale(.96)";

      card.style.transition =
      "0.8s cubic-bezier(.22,1,.36,1)";

      card.innerHTML = `

      <div class="left">

        <div class="icon">

          <img src="${product.image}">

        </div>

        <div class="info">

          <h2>${product.title}</h2>

          <p>
            ${product.description}
          </p>

        </div>

      </div>

      <div class="arrow">
        ›
      </div>

      `;

      productsContainer.appendChild(card);

      setTimeout(() => {

        card.style.opacity = "1";

        card.style.transform =
        "translateY(0px) scale(1)";

      }, 250 + (index * 150));



      // ==========================================
      // TILT 3D
      // ==========================================

      if(window.innerWidth > 768){

        card.addEventListener("mousemove", (e) => {

          const rect = card.getBoundingClientRect();

          const x = e.clientX - rect.left;

          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;

          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / 18);

          const rotateY = ((centerX - x) / 18);

          card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.015)
          `;

        });

        card.addEventListener("mouseleave", () => {

          card.style.transform = `
            perspective(1200px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
          `;

        });

      }



      // ==========================================
      // RIPPLE EFFECT
      // ==========================================

      card.addEventListener("click", function(e){

        const ripple =
        document.createElement("span");

        ripple.classList.add("ripple");

        this.appendChild(ripple);

        const rect =
        this.getBoundingClientRect();

        ripple.style.left =
        `${e.clientX - rect.left}px`;

        ripple.style.top =
        `${e.clientY - rect.top}px`;

        setTimeout(() => {

          ripple.remove();

        }, 700);

      });



      // ==========================================
      // TOUCH EFFECT MOBILE
      // ==========================================

      if(window.innerWidth <= 768){

        card.addEventListener("touchstart", () => {

          card.style.transform =
          "scale(.98)";

        });

        card.addEventListener("touchend", () => {

          setTimeout(() => {

            card.style.transform =
            "scale(1)";

          }, 120);

        });

      }



      // ==========================================
      // OBSERVER FADE
      // ==========================================

      const observer =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          if(entry.isIntersecting){

            entry.target.style.opacity = "1";

            entry.target.style.transform =
            "translateY(0px)";

          }

        });

      }, {

        threshold:0.08

      });

      observer.observe(card);

    });

    console.log("Produtos carregados 🚀");

  } catch(error) {

    console.error("Erro Firebase:", error);

  }

}

loadProducts();


// ==========================================
// STYLE RIPPLE
// ==========================================

const rippleStyle = document.createElement("style");

rippleStyle.innerHTML = `

.card{

  position:relative;

  overflow:hidden;

}

.ripple{

  position:absolute;

  width:20px;

  height:20px;

  background:rgba(255,255,255,.22);

  border-radius:50%;

  transform:translate(-50%,-50%);

  animation:ripple .7s linear;

  pointer-events:none;

}

@keyframes ripple{

  from{

    width:0px;
    height:0px;

    opacity:1;

  }

  to{

    width:650px;
    height:650px;

    opacity:0;

  }

}

`;

document.head.appendChild(rippleStyle);


// ==========================================
// GLOW PREMIUM NO MOUSE
// ==========================================

if(window.innerWidth > 768){

  const glow = document.createElement("div");

  glow.classList.add("mouse-glow");

  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {

    glow.style.left = `${e.clientX}px`;

    glow.style.top = `${e.clientY}px`;

  });

}


// ==========================================
// STYLE GLOW
// ==========================================

const glowStyle = document.createElement("style");

glowStyle.innerHTML = `

.mouse-glow{

  position:fixed;

  width:500px;

  height:500px;

  border-radius:50%;

  background:
  radial-gradient(circle,
  rgba(168,85,255,.13),
  transparent 70%);

  pointer-events:none;

  transform:translate(-50%,-50%);

  z-index:-1;

  filter:blur(20px);

  transition:
  left .12s linear,
  top .12s linear;

}

`;

document.head.appendChild(glowStyle);


// ==========================================
// BOTÃO COPIAR LINK
// ==========================================

const shareBtn =
document.querySelector(".share-btn");

shareBtn.addEventListener("click", async () => {

  try{

    await navigator.clipboard
    .writeText(window.location.href);

    shareBtn.innerHTML = "✔ Copiado";

    shareBtn.style.background =
    "rgba(0,255,140,.12)";

    shareBtn.style.borderColor =
    "rgba(0,255,140,.25)";

    shareBtn.style.boxShadow =
    "0 0 25px rgba(0,255,140,.2)";

    setTimeout(() => {

      shareBtn.innerHTML =
      "🔗 Copiar link";

      shareBtn.style.background = "";

      shareBtn.style.borderColor = "";

      shareBtn.style.boxShadow = "";

    }, 2200);

  }catch{

    alert("Não foi possível copiar.");

  }

});


// ==========================================
// PARALLAX
// ==========================================

window.addEventListener("scroll", () => {

  const scroll = window.scrollY;

  document.querySelector(".background")
  .style.transform =
  `translateY(${scroll * 0.12}px)`;

});


// ==========================================
// ANIMAÇÃO TOPO
// ==========================================

const profile =
document.querySelector(".profile");

profile.animate([

  {

    opacity:0,

    transform:"translateY(30px)"

  },

  {

    opacity:1,

    transform:"translateY(0px)"

  }

], {

  duration:1200,

  easing:"cubic-bezier(.22,1,.36,1)"

});


// ==========================================
// FINAL
// ==========================================

console.log("ZYQEN ULTRA PREMIUM V3 🚀");