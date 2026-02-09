/* ================================
   DOM ELEMENTS
================================ */

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const music = document.getElementById("bgMusic");
const yippee = document.getElementById("yippeeSound");
const flash = document.getElementById("flashOverlay");

/* ================================
   CONFIG / CONSTANTS
================================ */

const herName = "Reychelle";
let magnetStrength = 0; // increases after NO clicks
let noClickCount = 0;
let yesSize = 20;
let hasAccepted = false; // Prevent multiple YES clicks

// Random rejection messages
const messages = [
 "N-nani? are you sure? 🥺",
 "Think carefully pleaseee lods! 😭",
 "You're really pressing no?? 😩",
 "😭",
 "Mahal!!?? No??? 🥺😭",
 "Please reconsider idol..😭",
 "Last chance 😩",
 "Hmmph!!（￣へ￣）",
 "Please say yes loveee...😩"
];


/* ================================
   HELPER FUNCTIONS
================================ */

// Smooth audio volume transition
function fadeVolume(audio, targetVolume, duration) {

    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {

        currentStep++;

        audio.volume =
            startVolume + (targetVolume - startVolume) * (currentStep / steps);

        if (currentStep >= steps) {
            clearInterval(interval);
        }

    }, stepTime);
}

// Brief cinematic music pause
function dramaticPause(audio) {
    audio.pause();
    setTimeout(() => audio.play().catch(()=>{}), 200);
}

// Heart particle explosion effect
function heartExplosion() {

    const heartCount = 40;

    for(let i = 0; i < heartCount; i++) {

        const particle = document.createElement("div");
        particle.className = "heart-particle";

        // Random heart color
        particle.innerText = Math.random() > 0.5 ? "💗" : "💙";

        // Start at center
        particle.style.left = "50%";
        particle.style.top = "50%";

        // Random direction
        const randomX = (Math.random() - 0.5) * 800 + "px";
        const randomY = (Math.random() - 0.5) * 800 + "px";

        particle.style.setProperty("--x", randomX);
        particle.style.setProperty("--y", randomY);

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1500);
    }
}


/* ================================
   AUTO PLAY MUSIC (USER INTERACTION REQUIRED)
================================ */

document.body.addEventListener("click", () => {
    music.play().catch(()=>{});
}, { once: true });


/* ================================
   NO BUTTON INTERACTION
================================ */

noBtn.addEventListener("click", () => {

const emotionalMessages = [
  "N-nani? are you sure? 🥺",
  "Hmm… maybe think again? 😭",
  "Really??? That hurts 😩",
  "Mahal please! 😭💔",
  "I'm getting nervous now..uwaah 😭",
  "Okay now you're just teasing me 😤",
  "LAST CHANCE!! 😭❤️"
];

question.innerText =
  emotionalMessages[Math.min(noClickCount, emotionalMessages.length - 1)];

  // emotional shake effect
question.classList.add("shake");

setTimeout(() => {
  question.classList.remove("shake");
}, 300);

    noClickCount++;

    // grow YES button
    yesSize += 15;
    yesBtn.style.fontSize = yesSize + "px";
    // increase magnetic attraction slowly
    magnetStrength += 0.05;

    // VIRAL MECHANIC:
    // YES button slowly moves toward center after each NO
    

    // move NO randomly
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = "absolute";
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";

});

// ================================
// MAGNET EFFECT (subtle attraction)
// ================================

document.addEventListener("mousemove", (e) => {

    // stop magnet when heart becomes giant
    if (yesBtn.classList.contains("giant-heart")) return;

    // only activate after some NO clicks
    if (noClickCount < 2) return;

    const rect = yesBtn.getBoundingClientRect();

    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - buttonCenterX;
    const dy = e.clientY - buttonCenterY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    // only attract when cursor is near
    if (distance < 200) {

        const moveX = dx * magnetStrength;
        const moveY = dy * magnetStrength;

        yesBtn.style.position = "relative";

        yesBtn.style.left =
            (parseFloat(yesBtn.style.left || 0) + moveX * 0.02) + "px";

        yesBtn.style.top =
            (parseFloat(yesBtn.style.top || 0) + moveY * 0.02) + "px";
    }

});

// Controlled dodge behaviour (viral but fair)
noBtn.addEventListener("mouseover", () => {

    // Only start dodging after 3 NO clicks
    if (noClickCount < 3) return;

    // small delay so user can still click sometimes
    setTimeout(() => {

        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        noBtn.style.position = "fixed";
        noBtn.style.left = x + "px";
        noBtn.style.top = y + "px";

    }, 120); // delay = feels fair
});


/* ================================
   YES BUTTON INTERACTION
================================ */

yesBtn.addEventListener("click", () => {

    if (hasAccepted) return;
    hasAccepted = true;

    // Cinematic dramatic pause
    dramaticPause(music);

    // Flash effect
    flash.classList.add("flash-active");
    setTimeout(() => flash.classList.remove("flash-active"), 400);

    // Camera animation effects
    document.getElementById("mainContent")
        .classList.add("camera-zoom", "background-blur");

    // Lower music volume for effect
    fadeVolume(music, 0.2, 400);

    // Play confirmation sound
    yippee.currentTime = 0;
    yippee.play().catch(()=>{});

    yippee.onended = () => {
        fadeVolume(music, 0.7, 1200);
    };

    // Transform YES button into heart
    yesBtn.removeAttribute("style");
    yesBtn.classList.add("giant-heart");
    yesBtn.innerText = "";

    // Heartbeat background effect
    document.body.classList.add("heartbeat-bg");

    setTimeout(() => {
        document.body.classList.remove("heartbeat-bg");
    }, 3000);

    question.innerText =
        `YAAAAY 💗💙 I LOVE YOU ${herName}!!!`;

    // Confetti explosion
    confetti({
        particleCount: 550,
        spread: 100,
        origin: { y: 0.6 }
    });

    // Side confetti animation
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {

        confetti({
            particleCount: 5,
            angle: 60,
            spread: 70,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 5,
            angle: 120,
            spread: 70,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }

    })();

    // Transition to final message
    setTimeout(() => {

        heartExplosion();

        const main = document.getElementById("mainContent");

        main.classList.add("fade-out");

        setTimeout(() => {

            main.classList.remove("fade-out");

            main.innerHTML = `
            <div class="final-screen">
                <h1 class="final-text">
                    💖 Reychelle, you just made me the happiest person alive!! I LOVE YOU!!! 💖
                </h1>
                <img src="assets/dancing-cat.gif" class="final-cat">
                <p>❤️ You said YES!! Woohoo!! ❤️</p>
            </div>
            `;

            main.classList.add("final-mode");

        }, 1000);

    }, 2500);
});


/* ================================
   FLOATING HEART BACKGROUND EFFECT
================================ */

let heartToggle = true;

setInterval(() => {

    const heart = document.createElement("div");
    heart.className = "heart";

    heart.innerText = heartToggle ? "💗" : "💙";
    heartToggle = !heartToggle;

    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.bottom = "0px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);

}, 600); // Slightly reduced frequency for mobile performance
