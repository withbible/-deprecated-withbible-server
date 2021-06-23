let chart = {}

let dataPoints = []

function initChartUI(chapter) {
  return chart = new CanvasJS.Chart('chartContainer', {
    theme: 'them1',
    title: {
      text: `챕터 ${chapter}장 정답률 🤔`
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
        dataPoints: dataPoints,
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
  const query = new URLSearchParams(window.location.search);
  const chapter = query.get('chapter');
  chart = initChartUI(chapter);

  URL = "http://localhost:3000/quiz/api"
  fetch(URL + `?${query}`)
    .then(res => res.json())
    .then(data => {
      const quizPoint = countQuizPoints(data.quizs);
      for (let quiz in quizPoint) {
        dataPoints.push({ label: quiz, y: quizPoint[quiz] });
      }
      console.log(dataPoints);
      chart.render();
    })
})