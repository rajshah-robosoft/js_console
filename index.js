import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
import { parse } from "acorn";

let source = {};
let history = [];
let pos = 0;

let htmlConsoleField = document.querySelector(".consoleField");

let fieldWhileEnter = fromEvent(htmlConsoleField, "keyup").pipe(
  filter((e) => e.keyCode == 13 && !e.shiftKey)
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

  history.push(value);
  pos = history.length;

  let parsedValue = parse(value).body[0];

  if (parsedValue.type === "VariableDeclaration") {
    let inputValue;
    let inputValueObj = parsedValue.declarations[0].init;
    if (
      inputValueObj.type === "FunctionExpression" ||
      inputValueObj.type === "ArrowFunctionExpression"
    ) {
      inputValue = value.split("=")[1];
    } else {
      inputValue = parsedValue.declarations[0].init.value;
    }
    let checkObjectExist = source[arr[1]];

    if (checkObjectExist && parsedValue.kind === "const") {
      console.error(`Refrance error ${arr[1]} already in existance`);
      htmlConsoleField.value = "";
      return;
    } else {
      return add([arr[1]], { value: inputValue, type: parsedValue.kind });
    }
  }

  var checkObjectExist = source[arr[0]];
  if (checkObjectExist && checkObjectExist.value) {
    return print(checkObjectExist.value);
  }

  try {
    if (eval(value)) {
      return print(eval(value));
    }
  } catch (error) {
    console.error(error);
    htmlConsoleField.value = "";
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
  htmlConsoleField.value = "";
  resultsElement.innerHTML = value;
};
