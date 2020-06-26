import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

let source = {};
let history = [];
let pos = 0;

let htmlConsoleField = document.querySelector(".consoleField");

let fieldWhileEnter = fromEvent(htmlConsoleField, "keyup").pipe(
  filter((e) => e.keyCode == 13)
);

let fieldWhileArrowUp = fromEvent(htmlConsoleField, "keyup").pipe(
  filter((e) => e.key == "ArrowUp" && history.length > 0 && pos - 1 >= 0)
);

let fieldWhileArrowDown = fromEvent(htmlConsoleField, "keyup").pipe(
  filter(
    (e) => e.key == "ArrowDown" && history.length > 0 && pos < history.length
  )
);

fieldWhileArrowUp.subscribe(() => {
  pos = pos - 1;
  htmlConsoleField.value = history[pos] ? history[pos] : "";
});

fieldWhileArrowDown.subscribe(() => {
  pos = pos + 1;
  htmlConsoleField.value = history[pos] ? history[pos] : "";
});

fieldWhileEnter.subscribe((e) => {
  let value = e.target.value.trim("↵");
  let arr = value.split(" ");
  let keyValue = value.split("=");
  history.push(value);
  pos = history.length;

  keyValue = keyValue[keyValue.length - 1];

  if (["var", "let"].includes(arr[0])) {
    return add([arr[1]], keyValue);
  }

  const checkObjectExist = source[arr[0]];

  if (checkObjectExist?.length > 0) {
    return print(checkObjectExist);
  }

  if (eval(value)) {
    return print(eval(value));
  }

  return print(undefined);
});

const add = (...data) => {
  let newArr = { ...source };

  newArr[data[0]] = data[1];
  source = newArr;

  htmlConsoleField.value = "";
};

const print = (value) => {
  const resultsElement = document.getElementById("output");
  resultsElement.innerHTML = value;
  htmlConsoleField.value = "";
};
