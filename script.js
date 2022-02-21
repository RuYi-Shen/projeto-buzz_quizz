const API_URL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let USER_ID = JSON.parse(localStorage.getItem('my-quizzes')) || [];

let createdQuizz = null;

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
    let promiseQuizzesGet = axios.get(API_URL);
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
    <div class="quizz">
        <div class="gradient-layer" data-identifier="general-quizzes" onclick="openQuizz(${quizz.id})"><h3>${quizz.title}</h3></div>
        <img src="${quizz.image}" alt="quizz image">
        <div class="quizz-settings">
            <ion-icon name="create-outline" onclick="editQuizz(${quizz.id})"></ion-icon>
            <ion-icon name="trash-outline" onclick="removeQuizz(${quizz.id})"></ion-icon>
        </div>
    </div>
    `
}

function renderAllQuizz(quizz){
    document.querySelector(".all-quizz .quizzes").innerHTML += `
    <div class="quizz" data-identifier="general-quizzes" onclick="openQuizz(${quizz.id})">
        <div class="gradient-layer"><h3>${quizz.title}</h3></div>
        <img src="${quizz.image}" alt="quizz image">
    </div>
    `
}

function filterQuizzes(){
    myQuizzes = allQuizzes.filter(quizz => USER_ID.map(a => a.id).includes(quizz.id));
    allQuizzes = allQuizzes.filter(quizz => !USER_ID.map(a => a.id).includes(quizz.id));
}

function openQuizz(id){
    let thisQuizz = allQuizzes.concat(myQuizzes)
    thisQuizz = thisQuizz.filter((quizz) => quizz.id === id);
    if (thisQuizz.length > 1)
        console.error('ERROR: Two quizzes are being identified with the same id');
    else if (thisQuizz.length < 1)
        console.error('ERROR: Quizz not found');
    else {
        thisQuizz = thisQuizz[0];
        openQuizzPage(thisQuizz)
    }
}

function openQuizzPage(quizz) {
    const quizzPage = document.querySelector(".quizz-page");
    quizzPage.innerHTML = renderQuizzPage(quizz);
    switchScreen('.quizz-page');
}

function initializeQuizzCreation() {
    allWrongLevel = false;

    [...document.querySelectorAll('input')].forEach((input) => input.value = "");
    [...document.querySelectorAll('textarea')].forEach((textA) => textA.value = "");
}

function createNewQuizz(){
    initializeQuizzCreation();
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
            <ion-icon data-identifier="expand" name="create-outline" onclick="showQuestionForm(${i})"></ion-icon>
        </section>
        <section class="question hide" data-identifier="expand">
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
    let myAnswers = [
        {
            text: rightAnswer,
            image: rightAnswerImage,
            isCorrectAnswer: true
        }
    ]

    if(wrongAnswer1)
        myAnswers.push({
            text: wrongAnswer1,
            image: wrongAnswer1Image,
            isCorrectAnswer: false
        })
    if(wrongAnswer2)
        myAnswers.push({
            text: wrongAnswer2,
            image: wrongAnswer2Image,
            isCorrectAnswer: false
        })
    if(wrongAnswer3)
        myAnswers.push({
            text: wrongAnswer3,
            image: wrongAnswer3Image,
            isCorrectAnswer: false
        })
        

    myQuizz.questions.push({
        title: questionText,
        color: questionColor,
        answers: myAnswers
    });
}

// quizz creation functions - level

function createLevel(){
    for(let i = 2; i < parseInt(creationLevel) + 1; i++){
        document.querySelector(".additional-levels").innerHTML += `
        <section class="level-header">
            <h3>Nível ${i}</h3>
            <ion-icon data-identifier="expand" name="create-outline" onclick="showLevelForm(${i})"></ion-icon>
        </section>
        <section class="level hide" data-identifier="level">
                <h3>Nível ${i}</h3>
                <input type="text" placeholder="Título do nível">
                <input type="number" min="0" max="100" placeholder="% de acerto mínima">
                <input type="url" pattern="https://.*" placeholder="URL da imagem do nível">
                <textarea placeholder="Descrição do nível"></textarea>
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
    let textareas = document.querySelectorAll(".quizz-creation.level textarea");
    myQuizz.levels = [];
    for(let i = 0; i < creationLevel; i++){
        levelTitle = inputs[0+(3*i)].value;
        hitPercentage = inputs[1+(3*i)].value;
        levelImage = inputs[2+(3*i)].value;
        levelDescription = textareas[0+i].value;
        if(validateLevelValues()){
            addToMyQuizzLevel();
        }else{
            alert("preencha os dados corretamente");
            return;
        }
    }
    if(allWrongLevel){ // ask about this
        switchScreen(".loading");
        console.log(myQuizz)
        axios
            .post(API_URL, myQuizz)
            .then(createSucess)
            .catch((error) => {
                console.error(error)
                alert('something went wrong ;--;')
            })
    }
}

function addToMyQuizzLevel(){
        myQuizz.levels.push({
        title: levelTitle,
        image: levelImage,
        text: levelDescription,
        minValue: hitPercentage
    });
}

// quizz creation functions - sucess 

function createSucess(response){
    createdQuizz = response.data
    const saveIds = JSON.stringify(USER_ID.concat({id: createdQuizz.id, key: createdQuizz.key}))
    localStorage.setItem('my-quizzes', saveIds)

    USER_ID = JSON.parse(localStorage.getItem('my-quizzes')) || [];

    const successPage = document.querySelector(".quizz-creation.sucess")
    successPage.innerHTML = successScreenTemplate(createdQuizz)
    
    successPage.querySelector('button').addEventListener('click', () => openQuizzPage(createdQuizz))
    switchScreen(".quizz-creation.sucess");
}

const successScreenTemplate = quizz => `
    <h2>Seu quizz está pronto!</h2>
    <div class="quizz">
        <div class="gradient-layer"><h6 id="quizz-creation-created">${quizz.title}</h6></div>
        <img src="${quizz.image}" alt="quizz image">
    </div>
    <section class="quizz-page-footer">
        <button>Abrir Quizz</button>
        <div onclick="closeQuizzPage()">Voltar pra home</div>
    </section>
`

// bonus functions

function editQuizz(id){
    
}

function removeQuizz(id){
    if (window.confirm("Você realmente deseja remover este Quizz?")) {
        switchScreen(".loading");
        const deleteKey = USER_ID.filter((e) => e.id === id)
        axios.delete(
            `${API_URL}/${id}`,
            { 
                headers: {"Secret-Key" : deleteKey[0].key}
            }
        ).then(() => {
            renderQuizzes()
            switchScreen(".quizz-list");
            alert("Quizz deletado com sucesso");
        })
    }
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
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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


/*
    Coisas a falar com o shen:

    word-break
    bugs que ele comentou e eu esqueci
*/