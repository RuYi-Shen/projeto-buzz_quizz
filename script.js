const API_URL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const USER_ID = 19992021;

let promiseQuizzesGet;
let allQuizzes = [];
let myQuizzes = [];

let creationTitle = "";
let creationImage = "";
let creationQuestion = 0;
let creationLevel = 0;

let questionText = "";
let questionColor = "";
let rightAnswer = "";
let rightAnswerImage = "";
let wrongAnswer1 = "";
let wrongAnswer1Image = "";
let wrongAnswer2 = "";
let wrongAnswer2Image = "";
let wrongAnswer3 = "";
let wrongAnswer3Image = "";

let levelTitle = "";
let hitPercentage = 0;
let levelImage = "";
let levelDescription = "";

let allWrongLevel = false;
 
let hexColor = /^#[0-9A-F]{6}$/i;

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

// quizz list functions

function renderQuizzes(answer){
    switchScreen(".quizz-list");
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

function openQuizz(id){
    let thisQuizz = allQuizzes.filter((quizz) => quizz.id === id);
    if (thisQuizz.length !== 1)
    {
        console.error('ERROR: Two quizzes are being identified with the same id');
        return 1;
    }
    thisQuizz = thisQuizz[0];
    
    const quizzPage = document.querySelector(".quizz-page");
    quizzPage.innerHTML = renderQuizzPage(thisQuizz);
    switchScreen('.quizz-page');
}

function createNewQuizz(){
    switchScreen(".quizz-creation.info");
}

// quizz creation functions - info

function goToQuestions(){
    let inputs = document.querySelectorAll(".quizz-creation.info input");
    creationTitle = inputs[0].value;
    creationImage = inputs[1].value;
    creationQuestion = inputs[2].value;
    creationLevel = inputs[3].value;
    if(validateInfoValues()){
        switchScreen(".quizz-creation.question");
        addToMyQuizzInfo();
        createQuestion();
    }else{
        alert("preencha os dados corretamente");
    }
}

function addToMyQuizzInfo(){
    myQuizz.title = creationTitle;
    myQuizz.image = creationImage;
}

// quizz creation functions - question

function createQuestion(){
    for(let i = 2; i < parseInt(creationQuestion) + 1; i++){
        document.querySelector(".additional-questions").innerHTML += `
        <section class="question-header">
            <h3>Pergunta ${i}</h3>
            <ion-icon name="create-outline" onclick="showQuestionForm(${i})"></ion-icon>
        </section>
        <section class="question hide">
            <h3>Pergunta ${i}</h3>
            <input type="text" placeholder="Texto da pergunta">
            <input type="text" placeholder="Cor de fundo da pergunta">
            <h3>Resposta Correta</h3>
            <input type="text" placeholder="Resposta correta">
            <input type="url" pattern="https://.*" placeholder="URL da imagem">
            <h3>Respostas Incorretas</h3>
            <input type="text" placeholder="Resposta incorreta 1">
            <input type="url" pattern="https://.*" placeholder="URL da imagem 1">
            <div class="wrong-answer-spacer"></div>
            <input type="text" placeholder="Resposta incorreta 2">
            <input type="url" pattern="https://.*" placeholder="URL da imagem 2">
            <div class="wrong-answer-spacer"></div>
            <input type="text" placeholder="Resposta incorreta 3">
            <input type="url" pattern="https://.*" placeholder="URL da imagem 3">
        </section>
        `;
    }
}

function showQuestionForm(index) {
    document.querySelectorAll(".additional-questions .question-header")[index - 2].classList.add("hide");
    document.querySelectorAll(".additional-questions .question")[index - 2].classList.remove("hide");
}

function goToLevels(){
    let inputs = document.querySelectorAll(".quizz-creation.question input");
    myQuizz.questions = [];
    for(let i = 0; i < creationQuestion; i++){
        questionText = inputs[0+(10*i)].value;
        questionColor = inputs[1+(10*i)].value;
        rightAnswer = inputs[2+(10*i)].value;
        rightAnswerImage = inputs[3+(10*i)].value;
        wrongAnswer1 = inputs[4+(10*i)].value;
        wrongAnswer1Image = inputs[5+(10*i)].value;
        wrongAnswer2 = inputs[6+(10*i)].value;
        wrongAnswer2Image = inputs[7+(10*i)].value;
        wrongAnswer3 = inputs[8+(10*i)].value;
        wrongAnswer3Image = inputs[9+(10*i)].value;
        if(validateQuestionValues()){
            addToMyQuizzQuestion();
        }else{
            alert("preencha os dados corretamente");
            return;
        }
    }
    switchScreen(".quizz-creation.level");
    createLevel();
}

function addToMyQuizzQuestion(){
    for(let i = 0; i < creationQuestion; i++){
        myQuizz.questions += {
            title: "Título da pergunta 1",
            color: "#123456",
            answers: [
					{
						text: "Texto da resposta 1",
						image: "https://http.cat/411.jpg",
						isCorrectAnswer: true
					},
					{
						text: "Texto da resposta 2",
						image: "https://http.cat/412.jpg",
						isCorrectAnswer: false
					}
				]
		};
        if(i < creationQuestion) {
            myQuizz.questions += ",";
        }
    }
}

// quizz creation functions - level

function createLevel(){
    for(let i = 2; i < parseInt(creationLevel) + 1; i++){
        document.querySelector(".additional-levels").innerHTML += `
        <section class="level-header">
            <h3>Nível ${i}</h3>
            <ion-icon name="create-outline" onclick="showLevelForm(${i})"></ion-icon>
        </section>
        <section class="level hide">
                <h3>Nível ${i}</h3>
                <input type="text" placeholder="Título do nível">
                <input type="number" min="0" max="100" placeholder="% de acerto mínima">
                <input type="url" pattern="https://.*" placeholder="URL da imagem do nível">
                <input type="text" class="description" placeholder="Descrição do nível">
        </section>
        `;
    }
}

function showLevelForm(index) {
    document.querySelectorAll(".additional-levels .level-header")[index - 2].classList.add("hide");
    document.querySelectorAll(".additional-levels .level")[index - 2].classList.remove("hide");
}

function goToFinish(){
    let inputs = document.querySelectorAll(".quizz-creation.level input");
    myQuizz.levels = [];
    for(let i = 0; i < creationLevel; i++){
        levelTitle = inputs[0+(4*i)].value;
        hitPercentage = inputs[1+(4*i)].value;
        levelImage = inputs[2+(4*i)].value;
        levelDescription = inputs[3+(4*i)].value;
        if(validateLevelValues()){
            addToMyQuizzLevel();
        }else{
            alert("preencha os dados corretamente");
            return;
        }
    }
    if(allWrongLevel){
        switchScreen(".quizz-creation.sucess");
        createSucess();
    }
}

function addToMyQuizzLevel(){
    for(let i = 0; i < creationLevel; i++){
        myQuizz.levels += {
            title: levelTitle,
            image: levelImage,
            text: levelDescription,
            minValue: hitPercentage
		};
        if(i < creationLevel) {
            myQuizz.questions += ",";
        }
    }
}

// quizz creation functions - sucess 

function createSucess(){

}

// validation functions

function validateInfoValues(){
    if(creationTitle.length >= 20 && isValidUrl(creationImage) && creationQuestion >= 3 && creationLevel >= 2) return true;
}

function validateQuestionValues(){
    if(questionText.length >= 20 && hexColor.test(questionColor) && rightAnswer != "" && isValidUrl(rightAnswerImage)){
        if((wrongAnswer1 != "" && isValidUrl(wrongAnswer1Image)) || (wrongAnswer2 != "" && isValidUrl(wrongAnswer2Image)) || (wrongAnswer3 != "" && isValidUrl(wrongAnswer3Image))) return true;
    }
}

function validateLevelValues(){
    if(hitPercentage == 0) allWrongLevel = true;
    if(levelTitle.length >= 10 && hitPercentage >= 0 && hitPercentage <= 100 && isValidUrl(levelImage) && levelDescription.length >= 30) return true;
}


// global functions

function getError(error){
    console.log(error.response);
}

function switchScreen(screen) {
    [...document.querySelectorAll('main')]
        .forEach((main) => {
            main.classList.add('hide')
        })
    document.querySelector(screen).classList.remove('hide')
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

// Initialization 

switchScreen(".loading");
getQuizzes();


