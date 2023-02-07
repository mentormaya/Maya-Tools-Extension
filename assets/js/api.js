$(".panel-collapse").on("show.bs.collapse", function () {
  $(this).siblings(".panel-heading").addClass("active");
});

$(".panel-collapse").on("hide.bs.collapse", function () {
  $(this).siblings(".panel-heading").removeClass("active");
});

const resultEl = document.getElementById("result");

const clipboardBtn = document.getElementById("clipboard");

const generateBtn = document.getElementById("generate");

generateBtn.addEventListener("click", () => {
  let pinPassword = $("#pinPassword").val();
  let upper = $("#upper").val();
  let lower = $("#lower").val();
  let number = $("#numbers").val();
  let symbols = $("#symbols").val();

  console.log("pinPassword", pinPassword);
  console.log("upper", upper);
  console.log("lower", lower);
  console.log("number", number);
  console.log("symbols", symbols);

  resultEl.innerText = generatePassword(1, 1, 1, 1, 10);
  // toast("Password generated!");
});

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
  toast("Password copied to clipboard!");
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

