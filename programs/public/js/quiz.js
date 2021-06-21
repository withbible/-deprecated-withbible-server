
const quiz = document.getElementById("quiz");
const answersEls = document.querySelectorAll('.answer');
const question = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const submit = document.getElementById("submit");

let currentQuiz = 0;//푼문제수
let score = 0;//맞은 문제수
let quizData = [];
const URL = "http://localhost:3000"

class Quiz {
    o = 'O';
    x = 'X';

    constructor(question, correct) {
        this.question = question;
        this.correct = correct;
    }
}

class Quizs {
    constructor() {
        this.quizs = []
    }
    newQuiz(question, correct) {
        let quiz = new Quiz(question, correct)
        this.quizs.push(quiz)
        // return quiz
    }
    get allQuizs() { return this.quizs; }
}

window.addEventListener('load', e => {
    e.preventDefault();
    const options = {
        headers: { 'Accept': 'application/json' }
    }
    fetch(`${URL}/quiz/api/q${document.title.charAt(0)}`, options)
        .then(res => res.json())
        .then(data => {
            let quizs = new Quizs()
            data["data"].forEach(each => {
                if (each[0] == document.title.charAt(0)) {
                    quizs.newQuiz(each[1], each[2])
                }
            })
            console.log(quizs.allQuizs);
            quizData = quizs.allQuizs;
            loadQuiz()
        })
        .catch(err => console.log(err))
})

function loadQuiz() {//문제를 출력
    deselectAnswers();
    const currentQuizdata = quizData[currentQuiz];
    question.innerText = currentQuizdata.question;
    a_text.innerText = currentQuizdata.o;
    b_text.innerText = currentQuizdata.x;
}

function deselectAnswers() {//체크를 지워줌
    answersEls.forEach((answersEl) => {
        answersEl.checked = false;
    });
}

function getSelected() {//선택하면 값이 들어감
    let answer = undefined;

    answersEls.forEach((answersEl) => {
        if (answersEl.checked) {
            answer = answersEl.id;
        }
    });
    return answer;
}

next.addEventListener('click', nextquiz);


function nextquiz() {
    const answer = getSelected();

    if (answer) {//체크가 되어 있다면
        if (answer === quizData[currentQuiz].correct) {//정답일시
            score++;
        }
        currentQuiz++;
        if (currentQuiz < quizData.length) {//푼문제가 quizdata의 길이보다 작으면
            loadQuiz();//다음문제 실행
        }
        else {
            alert("다풀었어요. 전송을 누르세요");
        }
    }
}

submit.addEventListener('click', submitquiz);

function submitquiz() {
    const req = {
        score: score,
    };
    //서버로 score값 보내준다.
    fetch("/quiz/q1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    }).then((res) => res.json())//응답값을 보내줌(비동기)then을 사용한 이유
        //res.json의 반환값은 promise임으로
        //아래 then은 위에 then과 같이 res로 반환하기 때문에 생략가능
        .then((res) => {
            if (res.success) {
                alert("당신의 점수는 " + score + '/' + quizData.length + "입니다!");
                location.href = '/';
            }
        })
        .catch((err) => {
            console.error(new Error("점수 에러"));
        });
}

