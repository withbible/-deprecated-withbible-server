function countVotePoints(votes) {
  return votes.reduce(
    (acc, vote) => (
      (acc[vote.candidate] = (acc[vote.candidate] || 0) + parseInt(vote.points)), acc
    ), {}
  );
}

function cleanInput($input) {
  $input.value = '';
  $input.focus();
}

function drawCandidate(content, $result, type, activeDisabled = false) {
  var $p = document.createElement('p');
  var $label = document.createElement('label');
  $label.htmlFor = content;

  var $input = document.createElement('input');
  $input.type = type;
  $input.name = 'candidate';
  $input.id = content;
  $input.value = content;
  if (activeDisabled) $input.disabled = activeDisabled;

  var $span = document.createElement('span');
  $span.textContent = content;

  $label.appendChild($input);
  $label.appendChild($span);
  $p.appendChild($label);
  $result.insertBefore($p, $result.childNodes[0]);
}

export { countVotePoints, cleanInput, drawCandidate };