// parser
import { parse } from "acorn";

// global constant
import CONSTANT from "./constant";

// rxjs field functions
import {
  createKeyUpWithCustomKey,
  createKeyUpShiftEnter,
} from "./rxjs-field-creator";

// HTML related functions
import { findElementByID, addElementAsHTML } from "./html-field";

// Initial variables
let source = {};
let history = [];
let pos = 0;

// Gettting html tag of input via query selector
let htmlConsoleField = findElementByID("console");
let outputField = findElementByID("output");

const clearInput = () => (htmlConsoleField.value = "");

// currying via closure function
const addElementAsHTMLWithOutputField = addElementAsHTML(outputField);

const addElementAsHTMLWithOutputFieldWithError = addElementAsHTMLWithOutputField(
  CONSTANT.FIELD_TYPE.ERROR
);

const addElementAsHTMLWithOutputFieldDefault = addElementAsHTMLWithOutputField(
  CONSTANT.FIELD_TYPE.DEFAULT
);

// Using rxjs function to create observables
let fieldWhileEnter = createKeyUpShiftEnter(htmlConsoleField);

let fieldWhileArrowUp = createKeyUpWithCustomKey(
  htmlConsoleField,
  CONSTANT.KEYBOARD.ARROW_UP
);

let fieldWhileArrowDown = createKeyUpWithCustomKey(
  htmlConsoleField,
  CONSTANT.KEYBOARD.ARROW_DOWN
);

// Subscription to created custom functions
fieldWhileArrowUp.subscribe(() => {
  if (history.length > 0 && pos - 1 >= 0) {
    pos = pos - 1;
    htmlConsoleField.value = history[pos] ? history[pos] : "";
  }
});

fieldWhileArrowDown.subscribe(() => {
  if (history.length > 0 && pos < history.length) {
    pos = pos + 1;
    htmlConsoleField.value = history[pos] ? history[pos] : "";
  }
});

fieldWhileEnter.subscribe((e) => {
  // Cleaning input value and spliting it
  let value = e.target.value.trim("↵");
  let arr = value.split(" ");

  // Generating history of
  history.push(value);
  pos = history.length;

  // Genrating parse value and avoiding any error come during parser
  let parsedValue;

  try {
    parsedValue = parse(value).body[0];
  } catch {}

  // If parsed value is thee then only varibale will assign
  if (parsedValue.type === CONSTANT.ACORN_TYPES.VARIABLE_DECLARATION) {
    // Init parsed value and value which will asign to further block
    let inputValue;
    let inputValueObj = parsedValue.declarations[0].init;

    // Checking for reserved keyword
    if (
      CONSTANT.RESERVED_KEYWORD.filter((item) => item === arr[1]).length > 0
    ) {
      clearInput();

      return addElementAsHTMLWithOutputFieldWithError(
        `You can not declare ${value.split(" ")[1]}, it is reserved keyword`
      );
    }

    // Type checking via parser
    switch (inputValueObj.type) {
      case CONSTANT.ACORN_TYPES.FUNCTION_EXPRESSION:
      case CONSTANT.ACORN_TYPES.ARROW_FUNCTION_EXPRESSION:
        inputValue = value.split("=")[1];
        break;

      case CONSTANT.ACORN_TYPES.TEMPLATE_LITERAL:
        inputValue = inputValueObj.quasis[0].value.cooked;
        break;

      default:
        inputValue = inputValueObj.value;
        break;
    }

    // Checking if variable is already declared
    let checkObjectExist = source[arr[1]];

    if (checkObjectExist) {
      // Genrating error
      clearInput();

      return addElementAsHTMLWithOutputFieldWithError(
        `Refrance error ${arr[1]} already in existance`
      );
    } else {
      // Adding variable to object
      return addToObj([arr[1]], { value: inputValue, type: parsedValue.kind });
    }
  }

  // Cheacking weather clear is called
  if (value.match("clear") !== null) {
    source = {};
    clearInput();
    outputField.innerHTML = "";
    return;
  }

  // Checking if variable is exist and printing it
  var checkObjectExist = source[arr[0]];
  if (checkObjectExist && checkObjectExist.value) {
    clearInput();
    return addElementAsHTMLWithOutputFieldDefault(checkObjectExist.value);
  }

  // eval method of JS and cathing any other error
  try {
    eval(value);
    clearInput();
    return;
  } catch (error) {
    clearInput();
    return addElementAsHTMLWithOutputFieldWithError(error.message);
  }
});

// To add parsed object in source variable
const addToObj = (...data) => {
  let newArr = { ...source };

  newArr[data[0]] = data[1];
  source = newArr;
  clearInput();
};
