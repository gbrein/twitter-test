let button = document.getElementById('btn1');
button.addEventListener('click', function (event) {
  let queryValue = document.getElementsByName('exampleRadios');
  let checked = getRadioVal(queryValue, 'exampleRadios');
  app.post('search-results', checked);
});

function getRadioVal(form) {
  var val;
  for (var i = 0, len = form.length; i < len; i++) {
    if (form[i].checked) {
      val = form[i].value ;
      break;
    }
  }
  return val;
}

