import CONSTANT from "./constant";

// To check type of text
const checkType = (type, text) => {
  switch (type) {
    case CONSTANT.FIELD_TYPE.ERROR:
      return `<span style="color: red">${text}</span>`;

    default:
      return text;
  }
};

/**
 * This function will give element of html via ID
 * @param {*} id - id of element from HTML
 */
export const findElementByID = (id) => document.getElementById(id);

/**
 * To add text to output element
 * @param {*} htmlField - output element of html
 * @param {*} text - text which need to be added in HTML
 * @param {*} type - type of text
 */
export const addElementAsHTML = (htmlField) => (type) => (text) => {
  htmlField.innerHTML = checkType(type, text);
};
