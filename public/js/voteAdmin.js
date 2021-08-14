import { countVotePoints, cleanInput, drawCandidate } from '/js/utils.js';

const $submitForm = document.getElementById('submit-form');
const $inputForm = document.getElementById('input-form');
const $input = document.getElementById('input-ui');

const URL = "http://localhost:3000/vote"
// const URL = "https://ax2iey.deta.dev/poll";

let votes = {};

// init
window.addEventListener('load', () => {
  fetch(URL + "/api")
    .then(res => res.json())
    .then(data => {
      votes = countVotePoints(data.votes);
      Object.keys(votes).forEach((key, _) => {
        drawCandidate(key, $submitForm, 'checkbox', true);
      })
    })
})
// add Candidate
$inputForm.addEventListener('submit', (e) => {
  const value = $input.value;
  if (!Object.keys(votes).includes(value)) {
    votes[value] = "";
    drawCandidate(value, $submitForm, 'checkbox', false);
  }
  cleanInput($input);
  e.preventDefault();
})

// submit Candidate
$submitForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const choiceList = document.querySelectorAll('input[type=checkbox]:checked');
  const data = { candidates: [] };
  choiceList.forEach(choice => data["candidates"].push(choice.value));
  fetch(URL + "/admin", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
})
