import chalk from 'chalk';
import {
    Korean, FLAME, BLOCKED_LANGUAGES,
    ONEFLAME, ONEWORD, mandarin
} from './regexMaps.js';
import { permaban, filteredwords } from "./config.js";

const green = chalk.green;
const blue = chalk.blue;
const red = chalk.red;
const yellow = chalk.yellow;
const cyan = chalk.cyan;
const error = chalk.red;
const warning = chalk.bgRed;
const system = chalk.green;
const command = chalk.bgGreenBright;
const white = chalk.bgWhite;

export const colors = { green, blue, red, yellow, cyan, error, warning, system, command, white, setRGB }

function setRGB(R, G, B) {
    let rgb = chalk.rgb(R, G, B)
    return rgb;
}

export function setHex() {
  // TODO document why this function 'setHex' is empty


}

const flameString = FLAME.map(word => `(?<![A-Za-z])${word}(?![A-Za-z])`).join('|')
const regexLang = BLOCKED_LANGUAGES.map(word => `${word}`).join('|')
const characterRegex = ONEWORD.map(word => `(?<!@)${word}`).join('|')
const oneFlameString = ONEFLAME.map(word => `(?<!@)${word}`).join('|')
const koreanLang = Korean.map(word => `${word}`).join('|')

const jsonRegex = filteredwords.map(word => `(?<![A-Za-z])${word}(?![A-Za-z])`).join('|') //Creates a an Array of an Array and checking whether anything in that array matches returns as
//regex used for one word. 
const oneWordOnly = permaban.map(word => `${word}`).join('|')                             //a String. 
//const oneRegex = onemap.map(word => `${word}`).join('|')  
const mandarinRegex = mandarin.map(word => `${word}`).join('|');


//Regex Captures

export {
    mandarinRegex,
    oneWordOnly, jsonRegex,
    flameString, oneFlameString, koreanLang, characterRegex, regexLang
}