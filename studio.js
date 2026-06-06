window.initZyqenStudio = function(products = []){

  const root = document.getElementById("studioRoot");
  if(!root) return;

  root.innerHTML = `
    <div class="studio-wrap">

      <div class="studio-panel">

        <div class="studio-section-title">⚙️ Configurações da arte</div>

        <div class="studio-field">
          <label>Selecionar produto</label>
          <select id="studioProduct">
            <option value="">Escolha um produto</option>
            ${products.map((p,index)=>`
              <option value="${index}">
                ${p.name || "Produto sem nome"}
              </option>
            `).join("")}
          </select>
        </div>

        <div class="studio-grid-2">
          <div class="studio-field">
            <label>Formato</label>
            <select id="studioFormat">
              <option value="story">Story 1080x1920</option>
              <option value="post">Post 1080x1080</option>
            </select>
          </div>

          <div class="studio-field">
            <label>Template</label>
            <select id="studioTemplate">
              <option value="viral">Viral Roxo</option>
              <option value="gold">Oferta Gold</option>
              <option value="dark">Dark Premium</option>
            </select>
          </div>
        </div>

        <div class="studio-field">
          <label>Nome do produto</label>
          <input id="studioName" placeholder="Nome do produto">
        </div>

        <div class="studio-grid-2">
          <div class="studio-field">
            <label>Preço</label>
            <input id="studioPrice" placeholder="Ex: 37,99">
          </div>

          <div class="studio-field">
            <label>Preço antigo</label>
            <input id="studioOldPrice" placeholder="Ex: 99,90">
          </div>
        </div>

        <div class="studio-field">
          <label>Imagem do produto</label>
          <input id="studioImage" placeholder="URL da imagem">
        </div>

        <div class="studio-field">
          <label>Texto extra</label>
          <input id="studioTag" value="PRODUTO VIRAL">
        </div>

        <div class="studio-actions">
          <button class="studio-btn" id="studioPreviewBtn">Atualizar</button>
          <button class="studio-btn main" id="studioDownloadBtn">Baixar PNG</button>
        </div>

        <p class="studio-hint">
          A imagem não é salva no Firebase. Ela é usada apenas no navegador para gerar o PNG.
        </p>

      </div>

      <div class="studio-preview-area">
        <div class="studio-preview-top">
          <strong>Pré-visualização</strong>
          <span id="studioSizeText">Story 1080x1920</span>
        </div>

        <div class="studio-preview-box">
          <canvas id="studioCanvas" width="1080" height="1920"></canvas>
        </div>
      </div>

    </div>
  `;

  const productSelect = document.getElementById("studioProduct");
  const formatInput = document.getElementById("studioFormat");
  const templateInput = document.getElementById("studioTemplate");
  const nameInput = document.getElementById("studioName");
  const priceInput = document.getElementById("studioPrice");
  const oldPriceInput = document.getElementById("studioOldPrice");
  const imageInput = document.getElementById("studioImage");
  const tagInput = document.getElementById("studioTag");
  const previewBtn = document.getElementById("studioPreviewBtn");
  const downloadBtn = document.getElementById("studioDownloadBtn");
  const sizeText = document.getElementById("studioSizeText");
  const canvas = document.getElementById("studioCanvas");
  const ctx = canvas.getContext("2d");

  function money(value){
    const clean = String(value || "").replace("R$","").trim();
    return clean ? `R$ ${clean}` : "R$ 0,00";
  }

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function wrapText(text, x, y, maxWidth, lineHeight){
    const words = String(text || "").split(" ");
    let line = "";

    for(let n = 0; n < words.length; n++){
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);

      if(metrics.width > maxWidth && n > 0){
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      }else{
        line = testLine;
      }
    }

    ctx.fillText(line, x, y);
  }

  function loadImage(src){
    return new Promise((resolve) => {
      if(!src){
        resolve(null);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);

      img.src = src;
    });
  }

  function drawBackground(template,w,h){
    const gradient = ctx.createLinearGradient(0,0,w,h);

    if(template === "gold"){
      gradient.addColorStop(0,"#2b1d05");
      gradient.addColorStop(.5,"#090909");
      gradient.addColorStop(1,"#b8860b");
    }else if(template === "dark"){
      gradient.addColorStop(0,"#020202");
      gradient.addColorStop(.5,"#111");
      gradient.addColorStop(1,"#292929");
    }else{
      gradient.addColorStop(0,"#1c0030");
      gradient.addColorStop(.5,"#070012");
      gradient.addColorStop(1,"#5b00ff");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,w,h);

    ctx.globalAlpha = .18;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    for(let i = 0; i < 16; i++){
      ctx.beginPath();
      ctx.moveTo(-200,i * 160);
      ctx.lineTo(w + 200,i * 160 - 280);
      ctx.stroke();
    }

    ctx.globalAlpha = .18;
    ctx.fillStyle = "#ffffff";

    for(let i = 0; i < 34; i++){
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 5 + 2;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function drawProductImage(img,w,h,format){
    if(!img){
      ctx.fillStyle = "rgba(255,255,255,.08)";
      roundRect(170,format === "post" ? 235 : 420,w - 340,360,34);
      ctx.fill();

      ctx.fillStyle = "#aaa";
      ctx.font = "700 34px Poppins, Arial";
      ctx.textAlign = "center";
      ctx.fillText("Imagem do produto",w / 2,format === "post" ? 445 : 640);
      ctx.textAlign = "left";
      return;
    }

    const areaW = w * .82;
    const areaH = format === "post" ? h * .38 : h * .35;

    const ratio = Math.min(areaW / img.width, areaH / img.height);

    const imgW = img.width * ratio;
    const imgH = img.height * ratio;

    const imgX = (w - imgW) / 2;
    const imgY = format === "post" ? 250 : 430;

    ctx.shadowColor = "rgba(0,0,0,.65)";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 28;

    ctx.drawImage(img,imgX,imgY,imgW,imgH);

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }

  async function renderStudio(){
    const format = formatInput.value;
    const template = templateInput.value;

    const w = 1080;
    const h = format === "post" ? 1080 : 1920;

    canvas.width = w;
    canvas.height = h;

    sizeText.textContent = format === "post" ? "Post 1080x1080" : "Story 1080x1920";

    const name = nameInput.value || "Produto Viral";
    const price = money(priceInput.value || "37,99");
    const oldPrice = money(oldPriceInput.value || "99,90");
    const tag = tagInput.value || "PRODUTO VIRAL";
    const imageUrl = imageInput.value;

    drawBackground(template,w,h);

    ctx.fillStyle = "rgba(255,255,255,.09)";
    roundRect(70,70,w - 140,h - 140,42);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "900 56px Poppins, Arial";
    ctx.fillText("ZYQEN",90,145);

    ctx.fillStyle = "#ffd86b";
    ctx.font = "900 38px Poppins, Arial";
    ctx.fillText(tag.toUpperCase(),90,215);

    const productImg = await loadImage(imageUrl);
    drawProductImage(productImg,w,h,format);

    const baseY = format === "post" ? 705 : 1225;

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 70px Poppins, Arial";
    wrapText(name.toUpperCase(),90,baseY,w - 180,78);

    ctx.fillStyle = "#aaa";
    ctx.font = "700 38px Poppins, Arial";
    ctx.fillText(`De ${oldPrice}`,90,baseY + 175);

    ctx.strokeStyle = "#ff3131";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(90,baseY + 160);
    ctx.lineTo(350,baseY + 160);
    ctx.stroke();

    ctx.fillStyle = "#ffd86b";
    ctx.font = "900 106px Poppins, Arial";
    ctx.fillText(price,90,baseY + 300);

    const btnColor = template === "gold" ? "#ffd86b" : "#a855ff";

    ctx.fillStyle = btnColor;
    roundRect(90,baseY + 380,w - 180,96,28);
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.font = "900 38px Poppins, Arial";
    ctx.textAlign = "center";
    ctx.fillText("COMPRAR AGORA",w / 2,baseY + 442);
    ctx.textAlign = "left";
  }

  productSelect.addEventListener("change", () => {
    const selected = products[Number(productSelect.value)];

    if(!selected) return;

    nameInput.value = selected.name || "";
    priceInput.value = selected.price || "";
    imageInput.value = selected.image || "";

    renderStudio();
  });

  [
    formatInput,
    templateInput,
    nameInput,
    priceInput,
    oldPriceInput,
    imageInput,
    tagInput
  ].forEach(el => {
    el.addEventListener("input", renderStudio);
    el.addEventListener("change", renderStudio);
  });

  previewBtn.addEventListener("click", renderStudio);

  downloadBtn.addEventListener("click", async () => {
    await renderStudio();

    try{
      const link = document.createElement("a");
      link.download = "zyqen-anuncio.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }catch(error){
      alert("Não foi possível baixar. Use imagem com link direto ou hospedada no Firebase.");
    }
  });

  renderStudio();
};