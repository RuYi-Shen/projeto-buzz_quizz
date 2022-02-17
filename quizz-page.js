function renderQuizzPage(quizz) {
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
        <section class="quizz-page-result">
            <div class="rank-title">blabla</div>
            <img src="https://http.cat/200.jpg" alt="result-image">
            <p class="rank-description">dasdasdasdads</p>
        </section>
        <section class="quizz-page-footer">
            <button>Reiniciar Quizz</button>
            <div onclick="closeQuizzPage()">Voltar pra home</div>
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
    return `
        <div class="answer">
            <img src="${answer.image}" alt="answer-image">
            <p>${answer.text}</p>
        </div>
    `
}

function closeQuizzPage() {
    document.querySelector("main").classList.add("hide");
    document.querySelector(".quizz-list").classList.remove("hide");
    getQuizzes();
}