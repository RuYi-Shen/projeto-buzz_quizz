const API_URL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const USER_ID = 19992021;

let promiseQuizzesGet;
let allQuizzes = [];
let myQuizzes = [];

let creationTitle = "";
let creationImage = "";
let creationQuestion = 0;
let creationLevel = 0;



let myQuizz = {
    title: "",
    image: "",
    questions: [],
    levels: []
}



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
    <div class="quizz" onclick="openQuizz(${quizz.id})">
        <div class="gradient-layer"><h3>${quizz.title}</h3></div>
        <img src="${quizz.image}" alt="quizz image">
    </div>
    `
}

function renderAllQuizz(quizz){
    document.querySelector(".all-quizz .quizzes").innerHTML += `
    <div class="quizz" onclick="openQuizz(${quizz.id})">
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

function openQuizz(id){
    let thisQuizz = allQuizzes.filter((quizz) => quizz.id === id)
    if (thisQuizz.length !== 1)
    {
        console.error('ERROR: Two quizzes are being identified with the same id')
        return 1
    }
    thisQuizz = thisQuizz[0]
    
    const quizzPage = document.querySelector(".quizz-page")
    quizzPage.innerHTML = renderQuizzPage(thisQuizz)
    switchScreen('.quizz-page')
}

function createNewQuizz(){
    document.querySelector("main").classList.add("hide");
}

function goToQuestions(){
    let inputs = document.querySelectorAll(".quizz-creation.info input");
    creationTitle = inputs[0].value;
    creationImage = inputs[1].value;
    creationQuestion = inputs[2].value;
    creationLevel = inputs[3].value;
    if(validateInfoValues()){
        document.querySelector(".quizz-creation.info").classList.add("hide");
        document.querySelector(".quizz-creation.question").classList.remove("hide");
    }else{
        alert("preencha os dados corretamente");
    }
}

function validateInfoValues(){
    if(creationTitle.length >= 20 && isValidUrl(creationImage) && creationQuestion >= 3 && creationLevel >= 2) return true;
}

function isValidUrl(url) {
    let link;
   
    try {
      link = new URL(url);
    } catch (error) {
      return false;  
    }
    return true;
  }

function switchScreen(screen) {
    [...document.querySelectorAll('main')]
        .forEach((main) => {
            main.classList.add('hide')
        })
    document.querySelector(screen).classList.remove('hide')
}

// Initialization 

getQuizzes();