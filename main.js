"use strict";
async function getJokes(language, category, number) {
    const url = `https://fast-jokes.fastapicloud.dev/api/v1/jokes/${language}/${category}/${number}`;
    let data = await fetch(url)
        .then((response) => response.json())
        .catch((e) => console.error(e));
    if (data.jokes) {
        let createdJokes = [];
        for (let i of data.jokes) {
            let jokeData = {
                language: i.language,
                category: i.category,
                text: i.text
            };
            createdJokes.push(jokeData);
        }
        return createdJokes;
    }
    else {
        return data.detail;
    }
}
async function getTheJoke(id) {
    const url = `https://fast-jokes.fastapicloud.dev/api/v1/jokes/${id}`;
    let data = await fetch(url)
        .then((response) => response.json())
        .catch((e) => console.error(e));
    if (data.joke) {
        let createdJoke = {
            language: data.joke.language,
            category: data.joke.category,
            text: data.joke.text
        };
        return createdJoke;
    }
    else {
        return data.detail;
    }
}
async function loadJokes() {
    let chosenLanguage = document.querySelector("#selLang").value;
    let chosenCategory = document.querySelector("#selCat").value;
    let possibleNumber = document.querySelector("#selNum").value;
    let chosenNumber;
    if (possibleNumber == "all") {
        chosenNumber = 0;
    }
    else {
        chosenNumber = Number(possibleNumber);
    }
    let chosenId = document.querySelector("#jokeId").value;
    console.log(`Language = ${chosenLanguage}, Category = ${chosenCategory}, Number = ${chosenNumber}, ID = ${chosenId}`);
    let jokes = [];
    if (chosenId) {
        jokes = await getTheJoke(Number(chosenId));
        console.log(jokes);
    }
    else {
        jokes = await getJokes(chosenLanguage, chosenCategory, chosenNumber);
        console.log(jokes);
    }
    //Get place on page for jokes and clear it
    let jokeArea = document.querySelector("#jokes");
    console.log(jokeArea);
    jokeArea.innerHTML = "";
    if (Array.isArray(jokes) && typeof jokes[0] == "string") {
        buildStructure(jokeArea, 1);
        displaySingle(jokeArea, jokes[0], true);
    }
    else if (jokes.text) {
        buildStructure(jokeArea, 1);
        displaySingle(jokeArea, jokes.text);
    }
    else {
        buildStructure(jokeArea, jokes.length);
        displayMultiple(jokeArea, jokes);
    }
}
function buildStructure(area, number) {
    //Create articles
    for (let i = 0; i < number; i++) {
        let article = document.createElement("article");
        article.classList.add("message");
        article.classList.add("is-success");
        let text = document.createElement("div");
        text.classList.add("message-body");
        article.appendChild(text);
        area.appendChild(article);
    }
}
function displaySingle(area, data, error = false) {
    let article = area.children[0];
    if (error) {
        article.classList.remove("is-success");
        article.classList.add("is-warning");
        article.children[0].innerHTML = `Error: ${data}`;
    }
    else {
        article.classList.add("is-success");
        article.children[0].innerHTML = data;
    }
}
function displayMultiple(area, data) {
    for (let i in data) {
        area.children[i].children[0].innerHTML = data[i].text;
    }
}
window.onload = function () {
    document
        .querySelector("#btnAmuse")
        ?.addEventListener("click", loadJokes);
};
