

import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("Firebase conectado:", db);



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

    setTimeout(() => loader.remove(), 1000);

  }, 1400);

});




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
}

.loader-circle{
  width:120px;
  height:120px;
  border-radius:50%;
  border:3px solid rgba(168,85,255,.15);
  border-top:3px solid #a855ff;
  animation:spin 1s linear infinite;
}

@keyframes spin{
  to{ transform:rotate(360deg); }
}
`;

document.head.appendChild(loaderStyle);




async function loadProducts() {

  const productsContainer = document.querySelector(".products");

  if (!productsContainer) {
    console.error("Container .products não encontrado");
    return;
  }

  productsContainer.innerHTML = "";

  try {

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc, index) => {

      const product = doc.data();

      const name = product.name || "Sem nome";
      const price = product.price || "0";
      const image = product.image || "https://via.placeholder.com/300";
      const link = product.link || "#";

      const card = document.createElement("a");

      card.classList.add("card");

      card.href = link;
      card.target = "_blank";

      card.style.opacity = "0";
      card.style.transform = "translateY(45px) scale(.96)";
      card.style.transition = "0.8s cubic-bezier(.22,1,.36,1)";

      card.innerHTML = `
        <div class="left">

          <div class="icon">
            <img src="${image}" alt="${name}">
          </div>

          <div class="info">
            <h2>${name}</h2>
            <p>R$ ${price}</p>
          </div>

        </div>

        <div class="arrow">›</div>
      `;

      productsContainer.appendChild(card);

      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0px) scale(1)";
      }, 200 + (index * 120));

      // TILT 3D
      if (window.innerWidth > 768) {

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

      // RIPPLE
      card.addEventListener("click", function (e) {

        const ripple = document.createElement("span");
        ripple.classList.add("ripple");

        this.appendChild(ripple);

        const rect = this.getBoundingClientRect();

        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        setTimeout(() => ripple.remove(), 700);
      });

    });

    console.log("Produtos carregados 🚀");

  } catch (error) {
    console.error("Erro Firebase:", error);
  }
}

loadProducts();




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
  background:rgba(255,255,255,.25);
  border-radius:50%;
  transform:translate(-50%,-50%);
  animation:ripple .7s linear;
}

@keyframes ripple{
  from{ width:0; height:0; opacity:1; }
  to{ width:600px; height:600px; opacity:0; }
}
`;

document.head.appendChild(rippleStyle);




if (window.innerWidth > 768) {

  const glow = document.createElement("div");
  glow.classList.add("mouse-glow");
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

}




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




const shareBtn = document.querySelector(".share-btn");

if (shareBtn) {

  shareBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(window.location.href);

    shareBtn.innerHTML = "✔ Copiado";

    setTimeout(() => {
      shareBtn.innerHTML = "🔗 Copiar link";
    }, 2000);

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

  const blockedKeys = [
    "+",
    "-",
    "=",
    "0"
  ];

  if (
    (e.ctrlKey || e.metaKey) &&
    blockedKeys.includes(e.key)
  ) {
    e.preventDefault();
  }

}, { passive:false });


// ==========================================
// BLOQUEAR ZOOM IOS / ANDROID
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


document.addEventListener("touchmove", (e) => {

  if (
    e.scale !== undefined &&
    e.scale !== 1
  ) {
    e.preventDefault();
  }

}, { passive:false });


let lastTouchEnd = 0;

document.addEventListener("touchend", (e) => {

  const now = Date.now();

  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }

  lastTouchEnd = now;

}, { passive:false });



console.log("ZYQEN ULTRA PREMIUM V3 🚀");