import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * To create fromEvent with enter and shift enter supported
 * @param {*} htmlTag
 */
export const createKeyUpShiftEnter = (htmlTag) =>
  fromEvent(htmlTag, "keyup").pipe(
    filter((e) => e.keyCode == 13 && !e.shiftKey)
  );

/**
 * To create fromEvent with field
 * @param {*} htmlTag - element of html
 * @param {*} KEYBOARD_KEY - key name
 */
export const createKeyUpWithCustomKey = (htmlTag, KEYBOARD_KEY) =>
  fromEvent(htmlTag, "keyup").pipe(filter((e) => e.key == KEYBOARD_KEY));
