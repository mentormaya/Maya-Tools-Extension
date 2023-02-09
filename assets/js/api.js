// Tabs Script
$(".panel-collapse").on("show.bs.collapse", function () {
  $(this).siblings(".panel-heading").addClass("active");
});

$(".panel-collapse").on("hide.bs.collapse", function () {
  $(this).siblings(".panel-heading").removeClass("active");
});

/*
Password Generator Script starts from here
*/
$("#length").on("change mousemove", function () {
  $("#length_update").html($(this).val());
  if ($("#pinPassword").is(":checked"))
    localStorage.setItem("maya_password_length", $(this).val());
  else localStorage.setItem("maya_pin_length", $(this).val());
});

$("#pinPassword").on("change", () => {
  let pinPassword = $("#pinPassword").is(":checked");
  localStorage.setItem("pinPassword", pinPassword);
  if (pinPassword) {
    var length = localStorage.getItem("maya_password_length");
  } else {
    var length = localStorage.getItem("maya_pin_length");
  }
  $("#length").val(Number(length));
  $("#length_update").html(length);
});

$("#upper").on("change", () => {
  let upper = $("#upper").is(":checked");
  localStorage.setItem("upper", upper);
});

$("#lower").on("change", () => {
  let lower = $("#lower").is(":checked");
  localStorage.setItem("lower", lower);
});

$("#numbers").on("change", () => {
  let number = $("#numbers").is(":checked");
  localStorage.setItem("number", number);
});

$("#symbols").on("change", () => {
  let symbols = $("#symbols").is(":checked");
  localStorage.setItem("symbols", symbols);
});

//initialization of all values from the localStorage
(function () {
  let pinPassword = localStorage.getItem("pinPassword");
  pinPassword = JSON.parse(pinPassword);
  document.querySelector("#pinPassword").checked =
    pinPassword === null ? true : pinPassword;
  if (pinPassword) {
    var length = localStorage.getItem("maya_password_length");
    length = length === null ? 10 : length;
  } else {
    var length = localStorage.getItem("maya_pin_length");
    length = length === null ? 4 : length;
  }
  $("#length").val(Number(length));
  $("#length_update").html(length);
  let upper = localStorage.getItem("upper");
  document.querySelector("#upper").checked =
    upper === null ? true : JSON.parse(upper);
  let lower = localStorage.getItem("lower");
  document.querySelector("#lower").checked =
    lower === null ? true : JSON.parse(lower);
  let number = localStorage.getItem("number");
  document.querySelector("#numbers").checked =
    number === null ? true : JSON.parse(number);
  let symbols = localStorage.getItem("symbols");
  document.querySelector("#symbols").checked =
    symbols === null ? true : JSON.parse(symbols);
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

  if (pinPassword) {
    resultEl.innerText = generatePassword(
      lower,
      upper,
      number,
      symbols,
      length
    );
  } else {
    resultEl.innerText = generatePIN(length);
  }
});

function generatePIN(length = 4) {
  let generatedPIN = "";
  for (let i = 0; i < length; i++) {
    generatedPIN += getRandomNumber();
  }
  // toast(`Generated ${length} digit pin for you!`);
  return generatedPIN;
}

function copyToClipboard(content) {
  const textarea = document.createElement("textarea");
  textarea.value = content;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

clipboard.addEventListener("click", () => {
  const password = resultEl.innerText;

  if (!password) {
    return;
  }
  copyToClipboard(password);
  let pinPassword = $("#pinPassword").is(":checked");
  if (pinPassword) {
    toast("Password copied to clipboard!");
  } else {
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

// Password Generator Ends Here

/* api works goes here */
const API = "https://sapi.deta.dev";

let copyResultBtns = $(".copy-result-btn");

let getHomeBtn = $("#get_home_btn");
let homeStatus = document.querySelector("#api_home");
let homeStatusText = $("#api_home_ok");

let getNumbersBtn = $("#get_numbers_btn");
let numberStatus = document.querySelector("#api_numbers_status");

let getPANBtn = $("#get_pan_btn");
let panStaus = document.querySelector("#api_pan_status");

copyResultBtns.on("click", (event) => {
  let result = event.currentTarget.nextElementSibling.innerHTML;
  copyToClipboard(result);
  toast("Result copied to the Clipboard!");
});

getHomeBtn.on("click", () => {
  let result = $("#api_home_result");

  let api_url = API;
  result.html("Checking the API...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        homeStatus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        homeStatus.style.background = "#56c080";
        result.html(JSON.stringify(data, null, 2));
      }
    });
});

getNumbersBtn.on("click", () => {
  let result = $("#api_numbers_result");
  let number = $("#api_numbers_input");
  if (number.val() == "") {
    result.html("Please input your number!");
    return;
  }
  let api_url = `${API}/utilities/v1/numbers/nep_num/${number.val()}`;
  result.html("Getting Numbers...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        numberStatus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        number.val("");
        numberStatus.style.background = "#56c080";
        result.html(JSON.stringify(data, null, 2));
      }
    });
});

getPANBtn.on("click", () => {
  let result = $("#api_pan_result");
  let pan = $("#api_pan_input");
  if (pan.val() == "") {
    result.html("Please input your number!");
    return;
  }
  let api_url = `${API}/pan/v1/${pan.val()}`;
  result.html("Getting Pan Details...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        panStaus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        pan.val("");
        panStaus.style.background = "#56c080";
        result.html(JSON.stringify(data, null, 2));
      }
    });
});

/* Date Scripts Starts here */

let getTodayBtn = $("#get_today_btn");
let todayDateStatus = document.querySelector("#today_date_status");

getTodayBtn.on("click", () => {
  let result = $("#api_today_result");

  let api_url = `${API}/today`;
  result.html("fetching today's date...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        todayDateStatus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        todayDateStatus.style.background = "#56c080";
        result.html(`${data.full_nep_date_nep}(${data.full_int_date})`);
      }
    });
});

let getNepDateBtn = $("#get_date_to_nep_btn");
let getNepDateStatus = document.querySelector("#api_date_to_nep_status");

getNepDateBtn.on("click", () => {
  let result = $("#api_date_to_nep_result");

  let datestring = $("#api_date_to_nep_input");

  if (datestring.val() == "") {
    result.html("Please input date!");
    return;
  }

  let api_url = `${API}/date/to/nep/${datestring.val()}`;
  result.html("converting the given date...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        getNepDateStatus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        datestring.val("");
        getNepDateStatus.style.background = "#56c080";
        result.html(`${data.miti}(${data.int_date})`);
      }
    });
});

let getIntDateBtn = $("#get_date_to_int_btn");
let getIntDateStatus = document.querySelector("#api_date_to_int_status");

getIntDateBtn.on("click", () => {
  let result = $("#api_date_to_int_result");

  let datestring = $("#api_date_to_int_input");

  if (datestring.val() == "") {
    result.html("Please input date!");
    return;
  }

  let api_url = `${API}/date/to/int/${datestring.val()}`;
  result.html("converting the given date...");
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        getIntDateStatus.style.background = "red";
        result.html("Something went wrong!");
      } else {
        datestring.val("");
        getIntDateStatus.style.background = "#56c080";
        result.html(`${data.miti}(${data.int_date})`);
      }
    });
});

let refreshResultBtns = $(".refresh-result-btn");

(function(){
  let api_url = `${API}/nea/v1/list/meters`;
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      let json = response.json();
      // console.log(json);
      return json;
    })
    .then((meters_json) => {
      if (!meters_json) {
        console.log(meters_json);
      } else {
        meters_json.forEach((meter) => {
          if(!meter.includes("OLD"))
            $("#api_meter_bill_select").append(new Option(meter, meter));
        });
      }
    });
})();

async function fetchBills(api_url, status, result, billOf = null, input = null){
  fetch(api_url, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      let json = response.json();
      // console.log(json);
      return json;
    })
    .then((data) => {
      if (!data) {
        console.log(data);
        status.style.background = "red";
        result.html("Something went wrong!");
        toast("Something went wrong!");
        return false;
      } else {
        if(input !== null) input.val("");
        status.style.background = "#56c080";
        let bills = {};
        if(Array.isArray(data)){
          data.forEach((bill) => {
            bills[bill.name] = bill.state
          });
        } else {
          bills[data.name] = data.state
        }
        result.html(JSON.stringify(bills, null, 2));
        if(billOf !== null){
          toast(`${meter} fetched from the API!`);
        } else {
          toast(`NEA Bills fetched from the API!`);
        }
        return true;
      }
    });
}

refreshResultBtns.on("click", async (event) => {
  let btn = event.currentTarget;
  let result, status, api_url;
  switch (btn.dataset.trigger) {
    case "home_bills":
      //fetch home bills from the api
      result = $("#api_nea_bills_result");
      status = document.querySelector("#api_nea_bills_status");

      api_url = `${API}/nea/v1/`;

      result.html("fetching bills...");
      await fetchBills(api_url, status, result);
      break;

    case "meter_bill":
      //fetch meter bill from the api
      let meter = $("#api_meter_bill_select").val();
      result = $("#api_meter_bill_result");
      status = document.querySelector("#api_meter_bill_status");

      api_url = `${API}/nea/v1/meter/${meter}`;

      result.html("fetching bills...");
      await fetchBills(api_url, status, result, meter);
      break;

    default:
      break;
  }
});
