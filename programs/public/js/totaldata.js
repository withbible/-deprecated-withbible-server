let chart = {}

let dataPoints = {
  "chapter01": [

  ]
}

function initChartUI() {
  return chart = new CanvasJS.Chart('chartContainer', {
    theme: 'them1',
    title: {
      text: '챕터 1장 정답률 🤔'
    },
    data: [
      {
        type: 'pie',
        indexLabel: "#percent%",
        percentFormatString: "#0.##",
        toolTipContent: "{y}(#percent%)",
        indexLabel: "{label}",
        indexLabelPlacement: "inside",
        indexLabelFontSize: 15,
        dataPoints: dataPoints["chapter01"],
      }
    ]
  });
}

function countQuizPoints(quizs) {
  return quizs.reduce(
    (acc, quiz, idx) => {
      if (idx == 0) {
        quiz.scoreDetail.forEach((_, idx) => {
          acc[`q${idx + 1}`] = 0;
        })
      }
      quiz.scoreDetail.forEach((data, idx) => {
        if (data) {
          acc[`q${idx + 1}`] = ++acc[`q${idx + 1}`]
        }
      })
      return acc
    }, {}
  );
}

window.addEventListener('load', e => {
  chart = initChartUI();

  URL = "http://localhost:3000/quiz/api"
  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const quizPoint = (data.quizs);
      for (let quiz in quizPoint) {
        dataPoints["chapter01"].push({ label: quiz, y: quizPoint[quiz] });
      }
      chart.render();
    })
})