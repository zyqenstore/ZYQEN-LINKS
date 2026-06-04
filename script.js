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
// DEVICE / PERFORMANCE
// ==========================================

const isMobile = window.innerWidth <= 768;
const isSmallMobile = window.innerWidth <= 480;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ==========================================
// LOADING SCREEN
// ==========================================

const loader = document.createElement("div");

loader.classList.add("loader-screen");

loader.innerHTML = `
  <div class="loader-logo">

    <div class="loader-circle">
      <span>Z</span>
    </div>

    <h1>ZYQEN</h1>

  </div>
`;

document.body.appendChild(loader);

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    loader.style.transform = "scale(1.04)";

    setTimeout(() => {
      if(loader) loader.remove();
    }, 700);

  }, isMobile ? 650 : 1100);
});


// ==========================================
// STYLE LOADER
// ==========================================

const loaderStyle = document.createElement("style");

loaderStyle.innerHTML = `
.loader-screen{
  position:fixed;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  height:100dvh;
  background:#05010d;
  display:grid;
  place-items:center;
  z-index:999999;
  transition:.7s ease;
}

.loader-logo{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  transform:translateY(-25px);
}

.loader-logo h1{
  margin-top:18px;
  color:white;
  font-size:${isMobile ? "30px" : "42px"};
  letter-spacing:${isMobile ? "5px" : "8px"};
}

.loader-circle{
  position:relative;
  width:${isMobile ? "78px" : "120px"};
  height:${isMobile ? "78px" : "120px"};
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.loader-circle::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:50%;
  border:3px solid rgba(168,85,255,.15);
  border-top:3px solid #a855ff;
  animation:spin 1s linear infinite;
}

.loader-circle span{
  position:relative;
  z-index:2;
  font-size:${isMobile ? "40px" : "56px"};
  font-weight:800;
  color:#a855ff;
  line-height:1;
  user-select:none;
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

  const productsContainer = document.querySelector(".products");

  if (!productsContainer) {
    console.error("Container .products não encontrado");
    return;
  }

  productsContainer.innerHTML = "";

  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    if(querySnapshot.empty){
      productsContainer.innerHTML = `
        <div class="empty-products">
          Nenhum produto cadastrado ainda.
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    querySnapshot.forEach((docItem, index) => {

      const product = docItem.data();

      const name = product.name || "Sem nome";
      const price = product.price || "0";
      const image = product.image || "https://via.placeholder.com/300";
      const link = product.link || "#";

      const card = document.createElement("a");

      card.classList.add("card");

      card.href = link;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      card.style.opacity = "0";
      card.style.transform = isMobile
        ? "translateY(18px)"
        : "translateY(45px) scale(.96)";

      card.style.transition = prefersReducedMotion
        ? "none"
        : isMobile
          ? "0.35s ease"
          : "0.8s cubic-bezier(.22,1,.36,1)";

      card.innerHTML = `
        <div class="left">
          <div class="icon">
            <img src="${image}" alt="${name}" loading="lazy" draggable="false">
          </div>

          <div class="info">
            <h2>${name}</h2>
            <p>R$ ${price}</p>
          </div>
        </div>

        <div class="arrow">›</div>
      `;

      fragment.appendChild(card);

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0px) scale(1)";
      }, prefersReducedMotion ? 0 : 80 + (index * (isMobile ? 45 : 100)));

      // TILT 3D APENAS DESKTOP
      if (!isMobile && !prefersReducedMotion) {

        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateX = (y - rect.height / 2) / 18;
          const rotateY = (rect.width / 2 - x) / 18;

          card.style.transform = `
            perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
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

      // RIPPLE LEVE, SEM ATRAPALHAR SCROLL MOBILE
      card.addEventListener("click", function (e) {
        if(prefersReducedMotion) return;

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();

        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        setTimeout(() => ripple.remove(), isMobile ? 400 : 700);
      });

    });

    productsContainer.appendChild(fragment);

    console.log("Produtos carregados 🚀");

  } catch (error) {
    console.error("Erro Firebase:", error);

    productsContainer.innerHTML = `
      <div class="empty-products">
        Erro ao carregar produtos.
      </div>
    `;
  }
}

loadProducts();


// ==========================================
// RIPPLE STYLE
// ==========================================

const rippleStyle = document.createElement("style");

rippleStyle.innerHTML = `
.card{
  position:relative;
  overflow:hidden;
}

.ripple{
  position:absolute;
  width:16px;
  height:16px;
  background:rgba(255,255,255,.22);
  border-radius:50%;
  transform:translate(-50%,-50%);
  animation:ripple ${isMobile ? ".4s" : ".7s"} linear;
  pointer-events:none;
}

@keyframes ripple{
  from{ width:0; height:0; opacity:1; }
  to{ width:${isMobile ? "260px" : "600px"}; height:${isMobile ? "260px" : "600px"}; opacity:0; }
}

.empty-products{
  width:100%;
  padding:28px 18px;
  border-radius:20px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.08);
  color:#999;
  text-align:center;
  font-size:14px;
}
`;

document.head.appendChild(rippleStyle);


// ==========================================
// GLOW MOUSE - DESKTOP ONLY
// ==========================================

if (!isMobile && !prefersReducedMotion) {

  const glow = document.createElement("div");
  glow.classList.add("mouse-glow");
  document.body.appendChild(glow);

  let glowTicking = false;

  document.addEventListener("mousemove", (e) => {
    if(glowTicking) return;

    glowTicking = true;

    requestAnimationFrame(() => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glowTicking = false;
    });
  });
}


// ==========================================
// GLOW STYLE
// ==========================================

const glowStyle = document.createElement("style");

glowStyle.innerHTML = `
.mouse-glow{
  position:fixed;
  width:500px;
  height:500px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(168,85,255,.15), transparent 70%);
  pointer-events:none;
  transform:translate(-50%,-50%);
  z-index:-1;
  filter:blur(20px);
}
`;

document.head.appendChild(glowStyle);


// ==========================================
// INSTALL APP BUTTON
// ==========================================

let deferredPrompt = null;

const installBtn = document.getElementById("installBtn");

function isIOS(){
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(){
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone === true;
}

if(installBtn){

  installBtn.style.display = "none";

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();

    deferredPrompt = e;

    if(!isStandalone()){
      installBtn.style.display = "flex";
    }
  });

  installBtn.addEventListener("click", async () => {

    if(isIOS()){
      alert("Para instalar no iPhone: toque em Compartilhar e depois em Adicionar à Tela de Início.");
      return;
    }

    if(!deferredPrompt){
      alert("Se o botão de instalar não aparecer, abra o menu do navegador e toque em Instalar app.");
      return;
    }

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if(choiceResult.outcome === "accepted"){
      installBtn.style.display = "none";
    }

    deferredPrompt = null;
  });

  window.addEventListener("appinstalled", () => {
    installBtn.style.display = "none";
    deferredPrompt = null;
  });
}


// ==========================================
// BLOQUEAR ZOOM DESKTOP
// ==========================================

document.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
  }
}, { passive:false });

document.addEventListener("keydown", (e) => {

  const blockedKeys = ["+", "-", "=", "0"];

  if (
    (e.ctrlKey || e.metaKey) &&
    blockedKeys.includes(e.key)
  ) {
    e.preventDefault();
  }

});


// ==========================================
// BLOQUEAR ZOOM IOS / SAFARI
// ==========================================

document.addEventListener("gesturestart", (e) => {
  e.preventDefault();
});

document.addEventListener("gesturechange", (e) => {
  e.preventDefault();
});

document.addEventListener("gestureend", (e) => {
  e.preventDefault();
});


// ==========================================
// BLOQUEAR DUPLO TOQUE SEM TRAVAR SCROLL
// ==========================================

let lastTouchEnd = 0;

document.addEventListener("touchend", (e) => {
  const now = Date.now();

  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }

  lastTouchEnd = now;
}, { passive:false });


// ==========================================
// FINAL
// ==========================================

console.log("ZYQEN ULTRA PREMIUM OTIMIZADO 🚀");