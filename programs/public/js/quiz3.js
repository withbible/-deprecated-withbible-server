
const quizData = [
    {
        question: 'this는 함수를 호출할 때 결정된다.',
        a: 'O',
        b: 'X',
        correct: 'a'
    },
    {
        question: '명시적으로 this를 바인딩 하는 방법중에 call과 apply가 있는데 배열로 매개변수로 지정하는 것은 call이다.',
        a: 'O',
        b: 'X',
        correct: 'b'
    },
    {
        question: 'cannot assign to read only property "length" of object라고 에러가 나는 이유는 읽기 전용이기 때문이다.',
        a: 'O',
        b: 'X',
        correct: 'a'
    },
];


const quiz = document.getElementById("quiz");
const answersEls = document.querySelectorAll('.answer');
const question = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const submit = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

loadQuiz();

function loadQuiz() {//문제를 출력
    deselectAnswers();
    const currentQuizdata = quizData[currentQuiz];

    question.innerText = currentQuizdata.question;
    a_text.innerText = currentQuizdata.a;
    b_text.innerText = currentQuizdata.b;
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
    fetch("/quiz/q3", {
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

