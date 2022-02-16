const API_URL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const USER_ID = "shen_jaonolo"

let promiseQuizzesGet;
let allQuizzes = [];
let myQuizzes = [];


function getQuizzes(){
    promiseQuizzesGet = axios.get(API_URL);
    promiseQuizzesGet.then(renderQuizzes);
    promiseQuizzesGet.catch(getError);
}

function renderQuizzes(answer){
    allQuizzes = answer.data;
    console.log(answer.data);
    filterQuizzes();
    document.querySelector(".empty-quizz").classList.remove("hide");
    document.querySelector(".my-quizz-header").classList.add("hide");
    if(myQuizzes.length > 0){
        document.querySelector(".empty-quizz").classList.add("hide");
        document.querySelector(".my-quizz-header").classList.remove("hide");
        document.querySelector(".my-quizz .quizzes").innerHTML = "";
        myQuizzes.forEach(renderMyQuizz);
    }
    document.querySelector(".all-quizz .quizzes").innerHTML = "";
    allQuizzes.forEach(renderAllQuizz);
}

function renderMyQuizz(quizz){
    document.querySelector(".my-quizz .quizzes").innerHTML += `
    <div class="quizz" onclick="openQuizz(this)">
        <div class="gradient-layer"><h3>${quizz.title}</h3></div>
        <img src="${quizz.image}" alt="quizz image">
    </div>
    `
}

function renderAllQuizz(quizz){
    document.querySelector(".all-quizz .quizzes").innerHTML += `
    <div class="quizz" onclick="openQuizz(this)">
        <div class="gradient-layer"><h3>${quizz.title}</h3></div>
        <img src="${quizz.image}" alt="quizz image">
    </div>
    `
}

function filterQuizzes(){
    myQuizzes = allQuizzes.filter(quizz => {
        if (quizz.id == USER_ID) return true;
    });
    allQuizzes = allQuizzes.filter(quizz => {
        if (quizz.id != USER_ID) return true;
    });
}

function getError(error){
    console.log(error.response);
}

function openQuizz(){
    document.querySelector("main").classList.add("hide");
}

function createNewQuizz(){
    document.querySelector("main").classList.add("hide");
}

// Initialization 

getQuizzes();