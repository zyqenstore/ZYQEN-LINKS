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
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ==========================================
// CARD LAYOUT SYSTEM
// ==========================================

const layoutToggle = document.getElementById("layoutToggle");
const layoutIcon = document.getElementById("layoutIcon");

let currentLayout = localStorage.getItem("zyqen-card-layout") || "list";
let cachedProducts = [];
let isChangingLayout = false;

function updateLayoutIcon(){
  if(!layoutIcon) return;

  if(currentLayout === "list"){
    layoutIcon.src = "Icones/Icon/layout-grid.svg";
  }else{
    layoutIcon.src = "Icones/Icon/layout-list.svg";
  }
}

function applyProductsLayout(){
  const productsContainer = document.querySelector(".products");
  if(!productsContainer) return;

  productsContainer.classList.toggle("grid-view", currentLayout === "grid");
  updateLayoutIcon();
}

if(layoutToggle){
  layoutToggle.addEventListener("click", () => {
    if(isChangingLayout) return;

    isChangingLayout = true;

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
      card.classList.remove("slideleft-in", "slideleft-out");

      setTimeout(() => {
        card.classList.add("slideleft-out");
      }, index * 35);
    });

    setTimeout(() => {
      currentLayout = currentLayout === "list" ? "grid" : "list";

      localStorage.setItem("zyqen-card-layout", currentLayout);

      renderProducts(cachedProducts);

      const newCards = document.querySelectorAll(".card");

      newCards.forEach((card, index) => {
        card.classList.remove("slideleft-in", "slideleft-out");

        setTimeout(() => {
          card.classList.add("slideleft-in");
        }, index * 45);

        setTimeout(() => {
          card.classList.remove("slideleft-in");
        }, 650 + (index * 45));
      });

      setTimeout(() => {
        isChangingLayout = false;
      }, 800);

    }, 380);
  });
}


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
// HELPERS
// ==========================================

function safeText(value){
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ==========================================
// FIREBASE PRODUCTS
// ==========================================

async function loadProducts(){

  const productsContainer = document.querySelector(".products");

  if(!productsContainer){
    console.error("Container .products não encontrado");
    return;
  }

  productsContainer.innerHTML = "";

  try{
    const querySnapshot = await getDocs(collection(db, "products"));

    cachedProducts = [];

    querySnapshot.forEach((docItem) => {
      cachedProducts.push(docItem.data());
    });

    if(cachedProducts.length === 0){
      productsContainer.innerHTML = `
        <div class="empty-products">
          Nenhum produto cadastrado ainda.
        </div>
      `;
      return;
    }

    renderProducts(cachedProducts);

    console.log("Produtos carregados 🚀");

  }catch(error){
    console.error("Erro Firebase:", error);

    productsContainer.innerHTML = `
      <div class="empty-products">
        Erro ao carregar produtos.
      </div>
    `;
  }
}

function renderProducts(products){

  const productsContainer = document.querySelector(".products");

  if(!productsContainer) return;

  productsContainer.innerHTML = "";

  applyProductsLayout();

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {

    const name = safeText(product.name || "Sem nome");
    const price = safeText(product.price || "0");
    const image = product.image || "https://via.placeholder.com/300";
    const link = product.link || "#";

    const card = document.createElement("a");

    card.classList.add("card");

    if(currentLayout === "grid"){
      card.classList.add("card-square");
    }

    card.href = link;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    card.style.opacity = "1";
    card.style.transform = "translateX(0)";

    if(currentLayout === "grid"){

      card.innerHTML = `
        <div class="square-image">
          <img src="${image}" alt="${name}" loading="lazy" draggable="false">
        </div>

        <div class="square-info">
          <h2>${name}</h2>
          <p>R$ ${price}</p>

          <div class="buy-btn">
            <img
              src="Icones/Icon/shopping-bag.svg"
              alt=""
              draggable="false">
            <span>Comprar</span>
          </div>
        </div>
      `;

    }else{

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
    }

    fragment.appendChild(card);

    if(!isMobile && !prefersReducedMotion && currentLayout === "list"){

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

    card.addEventListener("click", function(e){
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

if(!isMobile && !prefersReducedMotion){

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

  if(isIOS() && !isStandalone()){
    installBtn.style.display = "flex";
  }

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
  if(e.ctrlKey || e.metaKey){
    e.preventDefault();
  }
}, { passive:false });

document.addEventListener("keydown", (e) => {

  const blockedKeys = ["+", "-", "=", "0"];

  if((e.ctrlKey || e.metaKey) && blockedKeys.includes(e.key)){
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

  if(now - lastTouchEnd <= 300){
    e.preventDefault();
  }

  lastTouchEnd = now;
}, { passive:false });


// ==========================================
// FINAL
// ==========================================

console.log("ZYQEN CARD LAYOUT SYSTEM ATIVO 🚀");