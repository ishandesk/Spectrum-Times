const API_KEY = "5142402a550640ba8f2c251254cd3ef4";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

    
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("darkmode");
        toggleButton.textContent = "☀️";
    }


    toggleButton.addEventListener("click", () => {
        if (body.classList.contains("darkmode")) {
            body.classList.remove("darkmode");
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙";
        } else {
            body.classList.add("darkmode");
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️";
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Update the top headline
    const topHeadline = document.getElementById("top-headline");
    
    // News API fetch
    fetch("https://newsapi.org/v2/top-headlines?country=us&apiKey=5142402a550640ba8f2c251254cd3ef4")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`News API responded with status ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Ensure the correct field and length of articles
            if (data && data.articles && data.articles.length > 0) {
                topHeadline.innerHTML = data.articles[0].title;
            } else {
                topHeadline.innerHTML = "No latest headlines available.";
            }
        })
        .catch((error) => {
            console.error("Error fetching top headlines:", error);
            topHeadline.innerHTML = "Error fetching top headlines.";
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        
        const weatherDataElement = document.getElementById("weather-data");
    
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
    
                    
                    const weatherAPIKey = "75348f8a432f151ffc997ff0f93e0731";
                    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKey}`;
                    
                    fetch(weatherURL)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`Weather API responded with status ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            const temperature = data.main.temp;
                            const location = data.name;
                            const condition = data.weather[0].description;
                            const icon = data.weather[0].icon;
    
                            weatherDataElement.innerHTML = `
                                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" /> 
                                ${temperature}°C, ${condition} in ${location}
                            `;
                        })
                        .catch((error) => {
                            console.error("Error fetching weather data:", error);
                            weatherDataElement.textContent = "Unable to fetch weather data.";
                        });
                },
                (error) => {
                    console.error("Error fetching geolocation:", error);
                    weatherDataElement.textContent = "Geolocation unavailable.";
                }
            );
        } else {
            weatherDataElement.textContent = "Geolocation not supported.";
        }
    });
    



