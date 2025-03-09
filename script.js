const apiKey = "77af93c1d0de99581cb9a8649282f178"; 
const resultDiv = document.getElementById("result");
const cityInput = document.getElementById("city");
const languageSelect = document.getElementById("language");

const translations = {
    "en": { "temperature": "Temperature", "weather": "Weather", "humidity": "Humidity", "cityNotFound": "City not found." },
    "th": { "temperature": "อุณหภูมิ", "weather": "สภาพอากาศ", "humidity": "ความชื้น", "cityNotFound": "ไม่พบเมืองนี้" }
};

// ✅ เปลี่ยนพื้นหลังตามอุณหภูมิ
function changeBackground(temp) {
    document.body.style.background = temp <= 15 
        ? "linear-gradient(to right, #00c6ff, #0072ff)" 
        : temp <= 30 
        ? "linear-gradient(to right, #ff9966, #ff5e62)" 
        : "linear-gradient(to right, #ff512f, #dd2476)";
}

// ✅ แสดงผลข้อมูลอากาศ
function displayWeather(data) {
    const lang = localStorage.getItem("selectedLanguage") || "en";

    if (data.cod === "404") {
        resultDiv.innerHTML = `<p>${translations[lang]["cityNotFound"]}</p>`;
        return;
    }

    resultDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        <p>${translations[lang]["temperature"]}: ${data.main.temp}°C</p>
        <p>${translations[lang]["weather"]}: ${data.weather[0].description}</p>
        <p>${translations[lang]["humidity"]}: ${data.main.humidity}%</p>
    `;
    changeBackground(data.main.temp);
}

// ✅ ดึงข้อมูลอากาศจาก API
async function fetchWeather(url) {
    resultDiv.innerHTML = `<div class="loading"></div>`; // แสดง Loading Animation
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        resultDiv.innerHTML = `<p>Error fetching data.</p>`;
    }
}

// ✅ ดึงข้อมูลอากาศจากชื่อเมือง
function getWeather() {
    if (!cityInput.value) {
        resultDiv.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    const lang = localStorage.getItem("selectedLanguage") || "en";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric&lang=${lang}`;
    fetchWeather(url);
}

// ✅ ดึงข้อมูลอากาศจากตำแหน่งปัจจุบัน
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        alert("เบราว์เซอร์ของคุณไม่รองรับ Geolocation");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const lang = localStorage.getItem("selectedLanguage") || "en";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=${lang}`;
        fetchWeather(url);
    }, () => {
        alert("ไม่สามารถดึงพิกัดของคุณได้ กรุณาเปิด GPS และลองใหม่อีกครั้ง");
    });
}

// ✅ Event Listeners
document.getElementById("search-btn").addEventListener("click", getWeather);
document.getElementById("current-location").addEventListener("click", getWeatherByLocation);
cityInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        getWeather();
    }
});
languageSelect.addEventListener("change", () => {
    localStorage.setItem("selectedLanguage", languageSelect.value);
    getWeather();
});

// ✅ โหลดค่าภาษาและดึงข้อมูลเมื่อเปิดเว็บ
window.onload = () => {
    languageSelect.value = localStorage.getItem("selectedLanguage") || "en";
    getWeather();
};
