let quizzLevels = []
let quizzId = 0

function renderQuizzPage(quizz) {
    quizzLevels = quizz.levels
    quizzId = quizz.id

    return `
        <section class="quizz-page-header"
            style="background-image: url('${quizz.image}')"
        >
            <div>
                <p>${quizz.title}</p>
            </div>
        </section>
        <section class="quizz-page-questions">
            ${quizz.questions
                .map(renderQuizzQuestion)
                .join('')
            }
        </section>
    `
}

function renderQuizzQuestion(question) {
    return `
        <article>
            <div class="question-title"
                style="background-color: ${question.color}"
            >
                ${question.title}
            </div>
            <div class="answers">
                ${question.answers
                    .map(renderQuizzAnswer)
                    .join('')
                }
            </div>
        </article>
    `
}

function renderQuizzAnswer(answer) {
    const correctClass = answer.isCorrectAnswer ? ' correct' : ''

    return `
        <div class="answer${correctClass}" onclick="selectAnswer(this)">
            <div></div>
            <img src="${answer.image}" alt="answer-image">
            <p>${answer.text}</p>
        </div>
    `
}

function closeQuizzPage() {
    getQuizzes();
}

function selectAnswer(answer) {
    if(answer.parentNode.classList.contains('locked'))
        return 0
    
    answer.classList.add('selected')
    answer.parentNode.classList.add('locked')

    scrollNextUnlocked()
}

function scrollNextUnlocked() {
    const nextUnlocked = [...document.querySelectorAll('.answers')]
                         .find((question) => !(question.classList.contains('locked')))

    if (nextUnlocked !== undefined)
        nextUnlocked.parentNode.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    else
        finishQuizz()
}

function finishQuizz() {
    const quizzPage = document.querySelector(".quizz-page")
    const rank = calculateRank()

    console.log(rank)

    setTimeout(
        (quizzPage) => {
            quizzPage.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }
    , 2000, quizzPage)

    quizzPage.innerHTML += `
        <section class="quizz-page-result">
            <div class="rank-title">${rank.title}</div>
            <img src="${rank.image}" alt="result-image">
            <p class="rank-description">${rank.text}</p>
        </section>
        <section class="quizz-page-footer">
            <button onclick="openQuizz(quizzId)">Reiniciar Quizz</button>
            <div onclick="closeQuizzPage()">Voltar pra home</div>
        </section>
    `
}

function calculateRank() {
    const correctAnswers = document.querySelectorAll('.selected.correct').length
    const questionsCount = document.querySelectorAll('.answers').length

    const correctPercentage = (correctAnswers/questionsCount)*100

    console.log(correctPercentage)
    return quizzLevels.filter(quizzLevel => quizzLevel.minValue < correctPercentage).pop()
}