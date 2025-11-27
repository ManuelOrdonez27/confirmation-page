// --------------------------------------------------
// GLOBAL AUDIO REFERENCES
// --------------------------------------------------
const sfxSend = document.getElementById('sfx-send');
const sfxSuccess = document.getElementById('sfx-success');
const sfxHover = document.getElementById('sfx-hover');
const sfxClick = document.getElementById('sfx-click');
const sfxIntro = document.getElementById('sfx-intro');

function playSound(audioEl, opts = {}) {
    try {
        audioEl.currentTime = 0;
        audioEl.volume = opts.volume ?? 0.25;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
    } catch (e) { console.warn("Playback failed", e); }
}


// --------------------------------------------------
// INTRO SOUND – PLAYS ON FIRST USER CLICK
// --------------------------------------------------
window.addEventListener("click", function firstClick() {
    if (sfxIntro) playSound(sfxIntro, { volume: 0.25 });
    window.removeEventListener("click", firstClick);
});


// --------------------------------------------------
// FOCUS / CLICK SOUND FOR INPUTS
// --------------------------------------------------
document.getElementById("name").addEventListener("focus", () => {
    playSound(sfxHover, { volume: 0.25 });
});

document.getElementById("guests-number").addEventListener("focus", () => {
    playSound(sfxHover, { volume: 0.25 });
});


// --------------------------------------------------
// SUBMIT HANDLER
// --------------------------------------------------
function handleSubmit(e) {
    e.preventDefault();

    const guestName = document.getElementById('name').value;
    const guestNumber = document.getElementById('guests-number').value;
    const spinner = document.getElementById('loader');
    const submitButton = document.getElementById('submitButton');

    if(localStorage.getItem('formSubmitted') === 'true') {
        alert("¡Ya confirmaste tu asistencia!, gracias 😁");
        return;
    }

    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    if (!namePattern.test(guestName)) {
        alert("Ingrese un nombre válido 😅");
        return;
    }

    if (guestNumber < 1 || guestNumber > 5) {
        alert("Número de personas no válido 🤔");
        return;
    }

    // Disable + sound
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    spinner.classList.remove("hidden");
    playSound(sfxSend, { volume: 0.18 });

    fetch(
      `https://script.google.com/macros/s/AKfycbx8HXuBg_-SPcFg7qOzRpOma-HjlQQvf58Wk2Ad3p0BO-cdPXcKa1UdjnesmpE_iUTS/exec?name=${encodeURIComponent(guestName)}&guests=${encodeURIComponent(guestNumber)}`
    )
    .then(response => response.text())
    .then(data => {
        console.log(data);
        localStorage.setItem('formSubmitted', 'true');
        window.location.href = 'thanks.html?name=' + encodeURIComponent(guestName);
    })
    .catch(error => {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar 🚀";
        spinner.classList.add("hidden");
        console.error(error);
    });
}

document.getElementById("guest-form").addEventListener("submit", handleSubmit);


