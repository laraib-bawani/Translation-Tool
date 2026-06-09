async function translateText() {

    let text = document.getElementById("inputText").value;
    let source = document.getElementById("sourceLang").value;
    let target = document.getElementById("targetLang").value;
    let output = document.getElementById("outputText");

    if (!text) {
        output.innerText = "Enter text first!";
        return;
    }

    output.innerText = "Translating...";

    try {

        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

        let response = await fetch(url);
        let data = await response.json();

        let translatedText = data[0].map(item => item[0]).join("");

        output.innerText = translatedText;

    } catch (error) {

        console.log(error);
        output.innerText = "Translation failed!";
    }
}

function copyText() {

    const text = document.getElementById("outputText").innerText;

    navigator.clipboard.writeText(text);

    alert("Copied!");
}

function speakText() {

    const text = document.getElementById("outputText").innerText;

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = document.getElementById("targetLang").value;

    window.speechSynthesis.speak(speech);
}

// Load languages from API
async function loadLanguages() {
    try {
        const res = await fetch("https://libretranslate.com/languages");
        const languages = await res.json();

        const source = document.getElementById("sourceLang");
        const target = document.getElementById("targetLang");

        languages.forEach(lang => {
            const option1 = document.createElement("option");
            option1.value = lang.code;
            option1.textContent = lang.name;

            const option2 = document.createElement("option");
            option2.value = lang.code;
            option2.textContent = lang.name;

            source.appendChild(option1);
            target.appendChild(option2);
        });

    } catch (error) {
        console.error("Failed to load languages:", error);
    }
}

function swapLanguages() {
    let source = document.getElementById("sourceLang");
    let target = document.getElementById("targetLang");

    let temp = source.value;
    source.value = target.value;
    target.value = temp;
}

function speakText() {
    const text = document.getElementById("outputText").innerText;

    if (!text || text === "Translation will appear here...") {
        alert("Nothing to speak!");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    // Optional: set language automatically (better speech)
    const targetLang = document.getElementById("targetLang").value;

    speech.lang = targetLang;

    // Voice settings (optional but makes it sound better)
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

function toggleTheme() {
    document.body.classList.toggle("light");

    // save preference
    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
}

// Load saved theme on refresh
window.onload = function () {
    loadLanguages(); // keep your language loader

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
    }
};


async function improveTextWithAI() {
    const text = document.getElementById("inputText").value;

    if (!text.trim()) {
        alert("Please enter text");
        return;
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer gsk_xsxbpEvzr8jwTbpIG73JWGdyb3FYVJwvHToeTYB5XP991IXJbIV"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "Fix grammar and improve sentence. Return only corrected text."
                    },
                    {
                        role: "user",
                        content: text
                    }
                ]
            })
        });

        const data = await res.json();

        console.log("FULL RESPONSE:", data); // 🔥 IMPORTANT

        if (!res.ok) {
            document.getElementById("outputText").innerText =
                "API Error: " + (data.error?.message || "Request failed");
            return;
        }

        if (data.choices && data.choices.length > 0) {
            document.getElementById("outputText").innerText =
                data.choices[0].message.content;
        } else {
            document.getElementById("outputText").innerText =
                "No AI response received";
        }

    } catch (error) {
        console.error(error);
        document.getElementById("outputText").innerText =
            "Network / CORS error";
    }
}
// Call it when page loads
window.onload = loadLanguages;