const screens = document.querySelectorAll(".screen");
const music = document.getElementById("music");
const circle = document.querySelector('.progress-ring__circle');
const holdArea = document.getElementById("holdCircle");

function showScreen(n) {
  screens.forEach(s => s.classList.remove("active"));
  screens[n].classList.add("active");
}

/* 1. PROGRESS RING LOGIC */
let holdVal = 440, timer;
function startHold() {
  function startHold(e) {
  // 1. Mobile par copy/selection menu rokne ka sahi tarika
  if (e && e.cancelable) {
    // Isse long-press menu nahi aayega par click/hold kaam karega
    e.stopPropagation(); 
  }

  // 2. Music wake up (GitHub/Mobile fix)
  if (music.paused) {
    music.play().then(() => music.pause()).catch(() => {});
  }

  // Purana timer logic jo aapne image mein dikhaya tha
  clearInterval(timer); // Pehle wala timer clear karein safety ke liye
  timer = setInterval(() => {
    holdVal -= 4; 
    if (holdVal <= 0) {
      clearInterval(timer);
      music.play();
      showScreen(1); // Screen 2 par le jayega
    }
    // Circle progress bar update
    if(circle) circle.style.strokeDashoffset = holdVal;
  }, 20);
}

// Event Listeners ko aise hi rehne dena
holdArea.addEventListener("mousedown", startHold);
holdArea.addEventListener("touchstart", startHold, { passive: false });
holdArea.addEventListener("mouseup", stopHold);
holdArea.addEventListener("touchend", stopHold);
holdArea.addEventListener("mouseleave", stopHold); // Agar finger bahar chali jaye
}
function stopHold() { clearInterval(timer); holdVal = 440; circle.style.strokeDashoffset = 440; }

holdArea.addEventListener("mousedown", startHold);
holdArea.addEventListener("touchstart", startHold);
holdArea.addEventListener("mouseup", stopHold);
holdArea.addEventListener("touchend", stopHold);

/* 2. DRAGGABLE CARDS LOGIC */
document.querySelectorAll(".draggable-card").forEach(card => {
  let isDragging = false, startX, startY;
  
  const startDrag = (e) => {
    const startDrag = (e) => {
  e.preventDefault(); // Screen drag rokne ke liye
  isDragging = true;
  // ...
};

const moveDrag = (e) => {
  if (!isDragging) return;
  e.preventDefault(); // Card move karte waqt screen na hile
  // ...
};
    isDragging = true;
    card.style.zIndex = 500;
    const t = e.type.includes('touch') ? e.touches[0] : e;
    startX = t.clientX - card.offsetLeft;
    startY = t.clientY - card.offsetTop;
    card.style.transition = "none";
  };
  
  const moveDrag = (e) => {
    if (!isDragging) return;
    const t = e.type.includes('touch') ? e.touches[0] : e;
    card.style.left = (t.clientX - startX) + "px";
    card.style.top = (t.clientY - startY) + "px";
  };
  
  const stopDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = "all 0.5s ease";
    // Check if thrown away
    const rect = card.getBoundingClientRect();
    if (rect.left < -50 || rect.right > window.innerWidth + 50 || rect.top < -50 || rect.bottom > window.innerHeight + 50) {
      card.style.opacity = "0";
      card.style.pointerEvents = "none";
    }
  };

  card.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", stopDrag);
  card.addEventListener("touchstart", startDrag);
  window.addEventListener("touchmove", moveDrag);
  window.addEventListener("touchend", stopDrag);
});

/* 3. GIFT CLICK & PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let parts = [];
function createP(x,y) {
  for(let i=0; i<50; i++) parts.push({x, y, dx:(Math.random()-0.5)*10, dy:(Math.random()-0.5)*10, s:Math.random()*4, c:`hsl(${Math.random()*360},70%,60%)`, l:60});
}
function anim() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  parts.forEach((p,i) => {
    ctx.fillStyle=p.c; ctx.beginPath(); ctx.arc(p.x,p.y,p.s,0,Math.PI*2); ctx.fill();
    p.x+=p.dx; p.y+=p.dy; p.l--;
    if(p.l<=0) parts.splice(i,1);
  });
  requestAnimationFrame(anim);
}
anim();

document.getElementById("giftBox").onclick = () => {
  createP(window.innerWidth/2, window.innerHeight/2);
  setTimeout(() => showScreen(2), 600);
};

/* 4. CLAIM & FLIP CARD */
document.getElementById("claim").onclick = () => showScreen(3);
document.querySelector(".flip-inner").onclick = function() {
  document.querySelector(".flip-card").classList.toggle("flipped");
};



