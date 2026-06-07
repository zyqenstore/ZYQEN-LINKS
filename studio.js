window.initZyqenStudio = function(products = []){

  const root = document.getElementById("studioRoot");
  if(!root) return;

  let uploadedImageData = null;
  let lastGeneratedBlob = null;

  const templates = [
    { id:"viral", name:"Viral Roxo", tag:"PRODUTO VIRAL", button:"COMPRAR AGORA" },
    { id:"gold", name:"Oferta Gold", tag:"OFERTA GOLD", button:"GARANTIR OFERTA" },
    { id:"dark", name:"Dark Premium", tag:"DARK PREMIUM", button:"VER PRODUTO" },
    { id:"clean", name:"Clean Branco", tag:"OFERTA ESPECIAL", button:"COMPRAR" },
    { id:"shop", name:"Loja Oferta", tag:"ACHADINHO DO DIA", button:"APROVEITAR" },
    { id:"neon", name:"Neon Tech", tag:"NEON TECH", button:"COMPRAR AGORA" },
    { id:"black", name:"Black Friday", tag:"BLACK FRIDAY", button:"PEGAR OFERTA" },
    { id:"shopee", name:"Shopee Style", tag:"SUPER OFERTA", button:"COMPRAR AGORA" },
    { id:"mercadolivre", name:"Mercado Livre Style", tag:"OFERTA IMPERDÍVEL", button:"VER OFERTA" },
    { id:"amazon", name:"Amazon Style", tag:"PRODUTO RECOMENDADO", button:"VER AGORA" },
    { id:"tiktok", name:"TikTok Viral", tag:"VIRAL NO TIKTOK", button:"QUERO ESSE" },
    { id:"luxo", name:"Luxo", tag:"SELEÇÃO PREMIUM", button:"COMPRAR" },
    { id:"minimal", name:"Minimalista", tag:"OFERTA CLEAN", button:"VER MAIS" },
    { id:"tech", name:"Produto Tech", tag:"GADGET TECH", button:"COMPRAR" },
    { id:"cozinha", name:"Cozinha", tag:"ITEM DE COZINHA", button:"GARANTIR" },
    { id:"fitness", name:"Fitness", tag:"PRODUTO FITNESS", button:"COMPRAR" },
    { id:"beleza", name:"Beleza", tag:"BELEZA E CUIDADO", button:"VER OFERTA" },
    { id:"infantil", name:"Infantil", tag:"PRODUTO INFANTIL", button:"COMPRAR" },
    { id:"natal", name:"Natal", tag:"PRESENTE ESPECIAL", button:"GARANTIR" },
    { id:"urgencia", name:"Urgência", tag:"ÚLTIMAS UNIDADES", button:"APROVEITAR" }
  ];

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
              ${templates.map(t => `
                <option value="${t.id}">${t.name}</option>
              `).join("")}
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
          <label>Imagem por link</label>
          <input id="studioImage" placeholder="URL da imagem">
        </div>

        <div class="studio-field">
          <label>Ou enviar imagem do celular</label>
          <input id="studioUpload" type="file" accept="image/*">
        </div>

        <div class="studio-field">
          <label>Texto extra</label>
          <input id="studioTag" value="PRODUTO VIRAL">
        </div>

        <div class="studio-grid-2">
          <div class="studio-field">
            <label>Mostrar botão?</label>
            <select id="studioShowButton">
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>

          <div class="studio-field">
            <label>Texto do botão</label>
            <input id="studioButtonText" value="COMPRAR AGORA">
          </div>
        </div>

        <div class="studio-field">
          <label>Link do produto</label>
          <input id="studioProductLink" placeholder="https://seulink.com">
        </div>

        <div class="studio-field">
          <label>Legenda pronta</label>
          <input id="studioCaption" placeholder="Clique no link da bio e confira!">
        </div>

        <div class="studio-actions">
          <button class="studio-btn" id="studioPreviewBtn">Atualizar</button>
          <button class="studio-btn main" id="studioDownloadBtn">Baixar PNG</button>
          <button class="studio-btn save" id="studioOpenBtn">Abrir imagem</button>
          <button class="studio-btn" id="studioCopyCaptionBtn">Copiar legenda</button>
        </div>

        <p class="studio-hint">
          No celular, prefira enviar a imagem pelo botão de arquivo. Links do Google, Brave, Shopee ou Mercado Livre podem bloquear a prévia.
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
  const uploadInput = document.getElementById("studioUpload");
  const tagInput = document.getElementById("studioTag");
  const showButtonInput = document.getElementById("studioShowButton");
  const buttonTextInput = document.getElementById("studioButtonText");
  const productLinkInput = document.getElementById("studioProductLink");
  const captionInput = document.getElementById("studioCaption");
  const previewBtn = document.getElementById("studioPreviewBtn");
  const downloadBtn = document.getElementById("studioDownloadBtn");
  const openBtn = document.getElementById("studioOpenBtn");
  const copyCaptionBtn = document.getElementById("studioCopyCaptionBtn");
  const sizeText = document.getElementById("studioSizeText");
  const canvas = document.getElementById("studioCanvas");
  const ctx = canvas.getContext("2d");

  function getTemplate(id){
    return templates.find(t => t.id === id) || templates[0];
  }

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

      if(!src.startsWith("data:") && !src.startsWith("blob:")){
        img.crossOrigin = "anonymous";
      }

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
      gradient.addColorStop(.5,"#111111");
      gradient.addColorStop(1,"#292929");
    }else if(template === "clean"){
      gradient.addColorStop(0,"#f7f7f7");
      gradient.addColorStop(.5,"#ffffff");
      gradient.addColorStop(1,"#e8e8e8");
    }else if(template === "shop" || template === "shopee"){
      gradient.addColorStop(0,"#ff4d00");
      gradient.addColorStop(.5,"#120600");
      gradient.addColorStop(1,"#ffb000");
    }else if(template === "mercadolivre"){
      gradient.addColorStop(0,"#fff200");
      gradient.addColorStop(.55,"#ffe600");
      gradient.addColorStop(1,"#0046ff");
    }else if(template === "amazon"){
      gradient.addColorStop(0,"#111111");
      gradient.addColorStop(.55,"#232f3e");
      gradient.addColorStop(1,"#ff9900");
    }else if(template === "tiktok"){
      gradient.addColorStop(0,"#000000");
      gradient.addColorStop(.55,"#111111");
      gradient.addColorStop(1,"#ff0050");
    }else if(template === "luxo"){
      gradient.addColorStop(0,"#120b02");
      gradient.addColorStop(.55,"#000000");
      gradient.addColorStop(1,"#d4af37");
    }else if(template === "minimal"){
      gradient.addColorStop(0,"#191919");
      gradient.addColorStop(.55,"#080808");
      gradient.addColorStop(1,"#000000");
    }else if(template === "tech"){
      gradient.addColorStop(0,"#001a33");
      gradient.addColorStop(.55,"#000000");
      gradient.addColorStop(1,"#0066ff");
    }else if(template === "cozinha"){
      gradient.addColorStop(0,"#4b2200");
      gradient.addColorStop(.55,"#120600");
      gradient.addColorStop(1,"#ff8a00");
    }else if(template === "fitness"){
      gradient.addColorStop(0,"#001f13");
      gradient.addColorStop(.55,"#05010d");
      gradient.addColorStop(1,"#00ff88");
    }else if(template === "beleza"){
      gradient.addColorStop(0,"#3a001f");
      gradient.addColorStop(.55,"#120010");
      gradient.addColorStop(1,"#ff5bbd");
    }else if(template === "infantil"){
      gradient.addColorStop(0,"#00c2ff");
      gradient.addColorStop(.55,"#ff8bd1");
      gradient.addColorStop(1,"#fff000");
    }else if(template === "natal"){
      gradient.addColorStop(0,"#002b16");
      gradient.addColorStop(.55,"#8b0000");
      gradient.addColorStop(1,"#ffd86b");
    }else if(template === "urgencia" || template === "black"){
      gradient.addColorStop(0,"#2b0000");
      gradient.addColorStop(.55,"#05010d");
      gradient.addColorStop(1,"#ff3131");
    }else if(template === "neon"){
      gradient.addColorStop(0,"#00111f");
      gradient.addColorStop(.55,"#05010d");
      gradient.addColorStop(1,"#00d4ff");
    }else{
      gradient.addColorStop(0,"#1c0030");
      gradient.addColorStop(.55,"#070012");
      gradient.addColorStop(1,"#5b00ff");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,w,h);

    const lightTemplates = ["clean","mercadolivre","infantil"];

    ctx.globalAlpha = lightTemplates.includes(template) ? .08 : .18;
    ctx.strokeStyle = lightTemplates.includes(template) ? "#111" : "#ffffff";
    ctx.lineWidth = 2;

    for(let i = 0; i < 16; i++){
      ctx.beginPath();
      ctx.moveTo(-200,i * 160);
      ctx.lineTo(w + 200,i * 160 - 280);
      ctx.stroke();
    }

    ctx.globalAlpha = lightTemplates.includes(template) ? .08 : .18;
    ctx.fillStyle = lightTemplates.includes(template) ? "#111" : "#ffffff";

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

  function getThemeColors(template){
    if(template === "clean"){
      return { title:"#111", muted:"#666", accent:"#5b00ff", button:"#5b00ff", buttonText:"#fff", glass:"rgba(0,0,0,.055)" };
    }

    if(template === "mercadolivre"){
      return { title:"#111", muted:"#333", accent:"#0046ff", button:"#0046ff", buttonText:"#fff", glass:"rgba(255,255,255,.35)" };
    }

    if(template === "infantil"){
      return { title:"#111", muted:"#333", accent:"#ff007f", button:"#111", buttonText:"#fff", glass:"rgba(255,255,255,.28)" };
    }

    if(template === "gold" || template === "luxo" || template === "natal"){
      return { title:"#fff", muted:"#d4d4d4", accent:"#ffd86b", button:"#ffd86b", buttonText:"#111", glass:"rgba(255,255,255,.09)" };
    }

    if(template === "shop" || template === "shopee"){
      return { title:"#fff", muted:"#ffe1c7", accent:"#ffd86b", button:"#ff4d00", buttonText:"#fff", glass:"rgba(255,255,255,.10)" };
    }

    if(template === "amazon"){
      return { title:"#fff", muted:"#d7e0e9", accent:"#ff9900", button:"#ff9900", buttonText:"#111", glass:"rgba(255,255,255,.09)" };
    }

    if(template === "tiktok"){
      return { title:"#fff", muted:"#ddd", accent:"#00f2ea", button:"#ff0050", buttonText:"#fff", glass:"rgba(255,255,255,.08)" };
    }

    if(template === "neon" || template === "tech"){
      return { title:"#fff", muted:"#bcefff", accent:"#00d4ff", button:"#00d4ff", buttonText:"#00111f", glass:"rgba(255,255,255,.08)" };
    }

    if(template === "fitness"){
      return { title:"#fff", muted:"#c7ffe6", accent:"#00ff88", button:"#00ff88", buttonText:"#001f13", glass:"rgba(255,255,255,.08)" };
    }

    if(template === "beleza"){
      return { title:"#fff", muted:"#ffd5ef", accent:"#ff8fd2", button:"#ff5bbd", buttonText:"#fff", glass:"rgba(255,255,255,.08)" };
    }

    if(template === "urgencia" || template === "black"){
      return { title:"#fff", muted:"#ddd", accent:"#ff3131", button:"#ff3131", buttonText:"#fff", glass:"rgba(255,255,255,.08)" };
    }

    return { title:"#fff", muted:"#aaa", accent:"#ffd86b", button:"#a855ff", buttonText:"#111", glass:"rgba(255,255,255,.09)" };
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

  function generateCaption(){
    const name = nameInput.value || "esse produto";
    const price = money(priceInput.value || "37,99");
    const link = productLinkInput.value.trim();
    const template = getTemplate(templateInput.value);

    const caption = `🔥 ${template.tag}\n\n${name}\nPor apenas ${price}\n\nConfira agora na Zyqen.\n${link ? link : "Link na bio."}`;
    captionInput.value = caption;
  }

  async function renderStudio(){
    const format = formatInput.value;
    const template = templateInput.value;
    const colors = getThemeColors(template);
    const w = 1080;
    const h = format === "post" ? 1080 : 1920;

    canvas.width = w;
    canvas.height = h;

    sizeText.textContent = format === "post" ? "Post 1080x1080" : "Story 1080x1920";

    const name = nameInput.value || "Produto Viral";
    const price = money(priceInput.value || "37,99");
    const oldPrice = money(oldPriceInput.value || "99,90");
    const tag = tagInput.value || getTemplate(template).tag;
    const imageUrl = uploadedImageData || imageInput.value;
    const showButton = showButtonInput.value === "yes";
    const buttonText = buttonTextInput.value || getTemplate(template).button;

    drawBackground(template,w,h);

    ctx.fillStyle = colors.glass;
    roundRect(70,70,w - 140,h - 140,42);
    ctx.fill();

    ctx.fillStyle = colors.title;
    ctx.font = "900 56px Poppins, Arial";
    ctx.fillText("ZYQEN",90,145);

    ctx.fillStyle = colors.accent;
    ctx.font = "900 38px Poppins, Arial";
    ctx.fillText(tag.toUpperCase(),90,215);

    const productImg = await loadImage(imageUrl);
    drawProductImage(productImg,w,h,format);

    const baseY = format === "post" ? 705 : 1225;

    ctx.fillStyle = colors.title;
    ctx.font = "900 70px Poppins, Arial";
    wrapText(name.toUpperCase(),90,baseY,w - 180,78);

    ctx.fillStyle = colors.muted;
    ctx.font = "700 38px Poppins, Arial";
    ctx.fillText(`De ${oldPrice}`,90,baseY + 175);

    ctx.strokeStyle = "#ff3131";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(90,baseY + 160);
    ctx.lineTo(350,baseY + 160);
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = "900 106px Poppins, Arial";
    ctx.fillText(price,90,baseY + 300);

    if(showButton){
      ctx.fillStyle = colors.button;
      roundRect(90,baseY + 380,w - 180,96,28);
      ctx.fill();

      ctx.fillStyle = colors.buttonText;
      ctx.font = "900 38px Poppins, Arial";
      ctx.textAlign = "center";
      ctx.fillText(buttonText.toUpperCase(),w / 2,baseY + 442);
      ctx.textAlign = "left";
    }else{
      ctx.fillStyle = colors.muted;
      ctx.font = "700 34px Poppins, Arial";
      ctx.fillText("ACESSE O LINK NA BIO",90,baseY + 410);
    }

    await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        lastGeneratedBlob = blob;
        resolve();
      }, "image/png");
    });
  }

  templateInput.addEventListener("change", () => {
    const selectedTemplate = getTemplate(templateInput.value);

    tagInput.value = selectedTemplate.tag;
    buttonTextInput.value = selectedTemplate.button;

    generateCaption();
    renderStudio();
  });

  productSelect.addEventListener("change", () => {
    const selected = products[Number(productSelect.value)];

    if(!selected) return;

    nameInput.value = selected.name || "";
    priceInput.value = selected.price || "";
    imageInput.value = selected.image || "";
    productLinkInput.value = selected.link || "";

    uploadedImageData = null;
    uploadInput.value = "";

    generateCaption();
    renderStudio();
  });

  uploadInput.addEventListener("change", () => {
    const file = uploadInput.files && uploadInput.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      uploadedImageData = reader.result;
      renderStudio();
    };

    reader.readAsDataURL(file);
  });

  [
    formatInput,
    nameInput,
    priceInput,
    oldPriceInput,
    imageInput,
    tagInput,
    showButtonInput,
    buttonTextInput,
    productLinkInput
  ].forEach(el => {
    el.addEventListener("input", () => {
      if(el === imageInput){
        uploadedImageData = null;
        uploadInput.value = "";
      }

      generateCaption();
      renderStudio();
    });

    el.addEventListener("change", () => {
      generateCaption();
      renderStudio();
    });
  });

  previewBtn.addEventListener("click", renderStudio);

  downloadBtn.addEventListener("click", async () => {
    await renderStudio();

    try{
      if(!lastGeneratedBlob){
        alert("Não foi possível gerar a imagem.");
        return;
      }

      const url = URL.createObjectURL(lastGeneratedBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "zyqen-anuncio.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 1000);

    }catch(error){
      alert("Se não baixar no celular, toque em 'Abrir imagem' e salve pela galeria.");
    }
  });

  openBtn.addEventListener("click", async () => {
    await renderStudio();

    if(!lastGeneratedBlob){
      alert("Não foi possível gerar a imagem.");
      return;
    }

    const url = URL.createObjectURL(lastGeneratedBlob);
    const newWindow = window.open(url, "_blank");

    if(!newWindow){
      alert("Permita pop-ups ou segure na imagem da prévia para salvar.");
    }
  });

  copyCaptionBtn.addEventListener("click", async () => {
    generateCaption();

    try{
      await navigator.clipboard.writeText(captionInput.value);
      alert("Legenda copiada.");
    }catch(error){
      captionInput.select();
      document.execCommand("copy");
      alert("Legenda copiada.");
    }
  });

  tagInput.value = getTemplate(templateInput.value).tag;
  buttonTextInput.value = getTemplate(templateInput.value).button;

  generateCaption();
  renderStudio();
};