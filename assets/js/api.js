$(".panel-collapse").on("show.bs.collapse", function () {
  $(this).siblings(".panel-heading").addClass("active");
});

$(".panel-collapse").on("hide.bs.collapse", function () {
  $(this).siblings(".panel-heading").removeClass("active");
});

$('#length').on("change mousemove", function() {
  $("#length_update").html($(this).val());
  if($("#pinPassword").is(":checked"))
    localStorage.setItem("maya_password_length", $(this).val());
  else
    localStorage.setItem("maya_pin_length", $(this).val());
});

$("#pinPassword").on("change", () => {
  let pinPassword = $("#pinPassword").is(":checked");
  localStorage.setItem('pinPassword', pinPassword);
  if (pinPassword){
    var length = localStorage.getItem("maya_password_length");
  } else {
    var length = localStorage.getItem("maya_pin_length");
  }
  $("#length").val(Number(length));
  $("#length_update").html(length);
});

$("#upper").on("change", () => {
  let upper = $("#upper").is(":checked");
  localStorage.setItem('upper', upper);
});

$("#lower").on("change", () => {
  let lower = $("#lower").is(":checked");
  localStorage.setItem('lower', lower);
});

$("#numbers").on("change", () => {
  let number = $("#numbers").is(":checked");
  localStorage.setItem('number', number);
});

$("#symbols").on("change", () => {
  let symbols = $("#symbols").is(":checked");
  localStorage.setItem('symbols', symbols);
});

//initialization of all values from the localStorage
(function(){
  let pinPassword = localStorage.getItem("pinPassword");
  pinPassword = JSON.parse(pinPassword);
  document.querySelector("#pinPassword").checked = pinPassword === null ? true : pinPassword;
  if (pinPassword){
    var length = localStorage.getItem("maya_password_length");
    length = length === null ? 10 : length;
  } else {
    var length = localStorage.getItem("maya_pin_length");
    length = length === null ? 4 : length;
  }
  $("#length").val(Number(length));
  $("#length_update").html(length);
  let upper = localStorage.getItem("upper");
  document.querySelector("#upper").checked = upper === null ? true : JSON.parse(upper);
  let lower = localStorage.getItem("lower");
  document.querySelector("#lower").checked = lower === null ? true : JSON.parse(lower);
  let number = localStorage.getItem("number");
  document.querySelector("#numbers").checked = number === null ? true : JSON.parse(number);
  let symbols = localStorage.getItem("symbols");
  document.querySelector("#symbols").checked = symbols === null ? true : JSON.parse(symbols);
  console.log(pinPassword, length, upper, lower);
})();

const resultEl = document.getElementById("result");

const clipboardBtn = document.getElementById("clipboard");

const generateBtn = document.getElementById("generate");

generateBtn.addEventListener("click", () => {
  let pinPassword = $("#pinPassword").is(":checked");
  let upper = $("#upper").is(":checked");
  let lower = $("#lower").is(":checked");
  let number = $("#numbers").is(":checked");
  let symbols = $("#symbols").is(":checked");

  let length = $("#length").val();

  if(pinPassword){
    resultEl.innerText = generatePassword(lower, upper, number, symbols, length);
  } else {
    resultEl.innerText = generatePIN(length);
  }
});

function generatePIN(length = 4){
  let generatedPIN = "";
  for (let i = 0; i < length; i++) {
    generatedPIN += getRandomNumber();
  }
  // toast(`Generated ${length} digit pin for you!`);
  return generatedPIN;
}

clipboard.addEventListener("click", () => {
  const textarea = document.createElement("textarea");
  const password = resultEl.innerText;

  if (!password) {
    return;
  }

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  let pinPassword = $("#pinPassword").is(":checked");
  if (pinPassword){
    toast("Password copied to clipboard!");
  } else{
    toast("PIN copied to clipboard!");
  }
});

function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = "";

  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  // Doesn't have a selected type
  if (typesCount === 0) {
    return "";
  }

  // create a loop
  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);

  return finalPassword;
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

