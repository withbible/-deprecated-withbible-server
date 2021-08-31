import { countVotePoints, cleanInput, drawCandidate } from '/js/utils.js';

const $form = document.getElementById('vote-form');
const $voteBtn = document.getElementById('vote-btn');
const $inputForm = document.getElementById('input-form');
const $input = document.getElementById('input-ui');

let dataPoints = [
  // { label: 'candidate1', y: 0 },
];

let totalVotes = 0;
let URL = "";
let chart = {};

var channel = initPusher();

function initPusher() {
  const chartContainer = document.querySelector('#chartContainer');
  if (chartContainer) {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    var pusher = new Pusher('3d3b60f48ff35ad9680a', {
      cluster: 'ap3'
    });

    return pusher.subscribe('candidate-poll');
  }
}
function initPreviousData(voteCounts) {
  for (let vote in voteCounts) {
    totalVotes += voteCounts[vote];
    dataPoints.push({ label: vote, y: voteCounts[vote] });
  }
}
function drawPreviousUI(voteCounts) {
  Object.entries(voteCounts).forEach(candidate => drawCandidate(candidate[0], $form, 'radio'))
};

function initChartUI(totalVotes, dataPoints) {
  return chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'them1',
    title: {
      text: `Total Votes ${totalVotes}`
    },
    data: [
      {
        indexLabel: "{label}",
        indexLabelPlacement: "inside",
        indexLabelOrientation: "horizontal",
        indexLabelFontSize: 15,
        type: 'column',
        dataPoints: dataPoints
      }
    ],
    axisY: {
      suffix: "표"
    }
  });
}
function disableVoteUI() {
  const disabledList = document.querySelectorAll('input[name=candidate]');
  disabledList.forEach(each => each.disabled = true)
  $voteBtn.disabled = true;
}
// init
window.addEventListener('load', () => {
  // URL = "https://ax2iey.deta.dev/poll";
  URL = "http://localhost:3000/vote/api"

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const votes = countVotePoints(data.votes);
      initPreviousData(votes);
      drawPreviousUI(votes);
      chart = initChartUI(totalVotes, dataPoints);
      chart.render();
    })
    .catch(err => console.log(err))
})
// add Candidate
$inputForm.addEventListener('submit', (e) => {
  const value = $input.value;
  const existCandidate = [];
  dataPoints.forEach(each => existCandidate.push(each.label));
  if (!(existCandidate.includes(value))) {
    dataPoints.push({ label: value, y: 0 });
    drawCandidate(value, $form, 'radio');
    cleanInput($input);
  }
  e.preventDefault();
})

// Vote Submit
$form.addEventListener('submit', (e) => {
  const choice = document.querySelector('input[name=candidate]:checked')
  const data = {
    candidate: choice.value,
    point: 1
  };

  fetch(URL, {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  disableVoteUI();
  e.preventDefault();
});

// realtime event handler when api trigger
channel.bind('candidate-vote', data => {
  dataPoints.forEach(point => {
    if (point.label == data.candidate) {
      point.y += data.points;
      totalVotes += data.points;
      chart.options.title.text = `Total Votes: ${totalVotes}`;
    }
  });
  chart.render();
});