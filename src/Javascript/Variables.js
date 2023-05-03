import moment from "moment";
import { colors } from "./syntax.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

let timeLastSentTimeoutMessage = new Date().getTime();
let sevenTvEmotes = [];
let lastRouletteCalled = new Date().getTime();
let deaths = "deaths";
let periodicMessages = ["We have listened to your suggestions, feedback and concerns, and we have applied a new patch into the live viewsite to address them.  Please consider filling out a survey if you have any suggestions or feedback https://forms.gle/qwGoD52o4A1qcyw26 🙏 (select \"Live View option\")."]
let timeLastSentTimeoutMessageTimer = new Date().getTime();
let lastChatMessageSent = "";
let timeSinceLastChatMessage = new Date().getTime();
let m = 1000;
let periodicMessageIndex = 0;
let lastMessageSentTime = 0;
let offlineMessageInterval = 600;
let onlineMessageInterval = 1800;
let isDeputy = true;
let day = 86400 * m;
let year = day * 365;
let decade = year * 10;

let __filename = fileURLToPath(import.meta.url);
export let __dirname = dirname(__filename)

function now () {
    return moment(new Date().getTime()).format("HH:mm A");
}

//current.format(format)
//console.log(current.format(format))
let localTime = new Date().toLocaleTimeString("CA");

export const variable = {
    timeLastSentTimeoutMessage, sevenTvEmotes, lastRouletteCalled,
    deaths, periodicMessages, timeLastSentTimeoutMessageTimer, lastChatMessageSent,
    timeSinceLastChatMessage, m, periodicMessageIndex,
    lastMessageSentTime, offlineMessageInterval, onlineMessageInterval, isDeputy
}
//operation is the function to call. 

export const time = {day, year, decade, localTime, now};