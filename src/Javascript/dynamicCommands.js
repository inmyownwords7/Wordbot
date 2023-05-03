import XRegExp from "xregexp";
import { banUser, stripMessageOfMentions, deleteWord, isStreamOnline, announce, HelixUserDate } from './utils.js';
import { timeoutHistory, banQueue, tempowords, channelsMap } from "./config.js";
import { loggers } from './LogConfig.js';
import { chat } from '../app.js';
import {time, variable} from './Variables.js';

import {
    koreanLang,
    characterRegex,
    oneWordOnly,
    regexLang,
    mandarinRegex,
    jsonRegex,
    flameString,
    oneFlameString,
    colors
} from "./syntax.js";
//TODOimport { onemap } from "./regexMap.js";
//! On going commands are written here. 

let timeLastSentTimeoutMessage = 0;

const referenced = "This originated from dynamicCommands.js";

async function foreignLanguageHandler(channel, user, text, msg, messageMetaData) {
    if (text === null || text === undefined || channel === "akanemsko") {
        return false;
    }

    const foreignMatch = stripMessageOfMentions(text).match(new XRegExp(regexLang, 'iu'))
    //this value is multiplied by thhe amount of times they've been timed out before
    let duration = 60;

    if (channelsMap.get(channel).isForeignEnabled) {
        //console.log(channelsMap.get(channel).isForeignEnabled)
        if (foreignMatch) {
            console.log(`${foreignMatch} ` + foreignMatch + " " + referenced)

            if (!messageMetaData.isStaff && !messageMetaData.isVip) {
                if (timeoutHistory.get(user)) {
                    let timeoutCount = timeoutHistory.get(user);
                    await banUser(channel, user, duration * timeoutCount, `You been warned before about speaking in other languages. ${foreignMatch} was flagged as another language.`)
                    loggers.syslogs.warn(colors.system(`${channel}: ${user}: ${text}`))
                    timeoutHistory.set(user, timeoutCount + 1)
                } else {
                    if (new Date().getTime() - timeLastSentTimeoutMessage > 600) {
                        //await say(channel, `@${user} Please keep the chat in English mods cannot understand that language. (This is an automated message) MrDestructoid.`)
                        console.log(`${user} has been warned. for saying ${text}`)
                        loggers.syslogs.warn(colors.system(`${channel}: ${user}: ${text}`))
                    }

                    timeLastSentTimeoutMessage = new Date().getTime();
                    await deleteWord(channel, msg);
                    loggers.syslogs.warn(colors.system(`${channel}: ${user}: ${msg.id}`))
                    timeoutHistory.set(user, 1)
                }//TODO Color quote variables such as user and text in the string. 
                loggers.syslogs.info(`${channel}: ${user} was flagged for saying ${text}`)
            }
        }
    }
}

async function accountageHandler(channel, user, text, msg, messageMetaData) {
    if (msg.isFirst) {
        if (channelsMap.get(channel).accountUserAge) {
            let current = new Date().getTime();
            let creationDate = await HelixUserDate(user)
            let date = current - creationDate.getTime();
            let day = time.day;
            let year = time.year;
            let decade = time.decade;

            if (date < day) {
                loggers.syslogs.info(channel + " " + user + "account is less than a day " + msg.isFirst)
                banUser(channel, user, null, `account is less than a day for ${user} in ${channel}`)
            }

            else if (date < year * 5) {
                //loggers.syslogs.info(channel + " " + user + "account is less than 5 years " + msg.isFirst)
            }

            else if (date < decade) {
                //loggers.syslogs.info(channel + " " + user + "account is less than 10 years " + msg.isFirst)

            } else {
                //loggers.syslogs.info(channel + " " + user + "account is not new " + msg.isFirst)
            }
        }
    }
}

async function flameHandler(channel, user, text, msg, messageMetaData) {
    if (text === null || text === undefined || channel === "akanemsko") {
        return false;
    }

    const flameMatch = stripMessageOfMentions(text).match(new XRegExp(flameString, 'iu'))
    //this value is multiplied by the amount of times they've been timed out before
    let duration = 60;

    if (channelsMap.get(channel).isFlamingEnabled) {
        if (flameMatch) {
            console.log(flameMatch + " word was captured by flameMatch.")
            if (!messageMetaData.isEntitled) {
                if (timeoutHistory.get(user)) {
                    let timeoutCount = timeoutHistory.get(user);
                    await banUser(channel, user, duration * timeoutCount, `AUTOMOD HAS DETECTED USAGE OF "${flameMatch}" YOU WILL NOW BE EXECUTED FOR ${duration} multiplied by ${timeoutCount}`)
                    loggers.syslogs.info(colors.system(`${channel}: ${user}: ${text}`))
                    timeoutHistory.set(user, timeoutCount + 1)
                } else {
                    if (new Date().getTime() - timeLastSentTimeoutMessage > 600) {
                        //await say(channel, `@${user} Please keep the chat in English mods cannot understand that language. (This is an automated message) MrDestructoid.`)
                        console.log(`${user} has been warned. for saying ${text}`)
                        loggers.syslogs.info(colors.system(`${channel}: ${user}: ${text}`))
                    }

                    timeLastSentTimeoutMessage = new Date().getTime();
                    await deleteWord(channel, msg);
                    loggers.syslogs.warn(colors.system(`${channel}: ${user}: ${msg.id}`))
                    timeoutHistory.set(user, 1)
                }//TODO Color quote variables such as user and text in the string. 
                loggers.syslogs.info(colors.error(`${channel}: ${user} was flagged for saying ${text}`))
            }
        }
    }
}

//constantly checks whether a certain word is captured in chat. Such that if text === ${word}. 
async function onGoingCommandsHandler(channel, user, text, msg, messageMetaData) {
    text = text.toLowerCase();
    let x = time.momentTime - time.localTime;
    if (text === `!7tv`) {
        chat.say("iwdominate", `${user}To enable 7TV on liveview site consider downloading this extension
        https://www.frankerfacez.com/ scroll down -> press download on chrome (if other browsers click on other browser and select your browser.) `)
    }

    if (!messageMetaData.isStaff) {
        for (let bannedPhrase of Array.from(banQueue.get(channel).keys())) {
            if (text.includes(bannedPhrase)) {
                let userArray = banQueue.get(channel).get(bannedPhrase);
                if (!userArray.includes(user)) {
                    userArray.push(user);
                    banQueue.get(channel).set(bannedPhrase, userArray);
                    console.log("adding " + user + " to banqueue")
                    loggers.syslogs.warn(colors.system(`${channel} ` + "adding " + user + " to banqueue"))
                }
            }
        }
    }

    if (text === `!test`) {
        chat.say(channel, `${x}`)
    }
}

//TODO Fix temporary handler needed to capture words though regex. 
async function tempoFilterHandler(channel, user, text, msg, messageMetaData) {
    let tempoRegex = tempowords.get(channel).map(word => `(?<![A-Za-z])${word}(?![A-Za-z])`).join('|');
    const tempoMatches = tempoRegex ? text.match(new XRegExp(tempoRegex, 'iu')) : undefined;
    if (channelsMap.get(channel).toggleTempo) {
        if (channel != "akanemsko") {
            if (tempoMatches) {
                if (!messageMetaData.isStaff && !messageMetaData.isVip) {
                    if (timeoutHistory.get(user)) {
                        let timeoutCount = timeoutHistory.get(user);
                        loggers.syslogs.warn(colors.system(`${channel}: ${user}: ${text}`))
                        await banUser(channel, user, 120 * timeoutCount, `You typed a banned phrase`)
                        timeoutHistory.set(user, timeoutCount + 1)
                    } else {
                        await banUser(channel, user, 120, `You typed a banned phrase`)
                        timeoutHistory.set(user, 1)
                    }
                }
            }
        }
    }
}

async function chooseAndSayMessageHandler() {
    if (await isStreamOnline("iwdominate")) {
        if (variable.periodicMessages.length > 0) {

            await announce("iwdominate", variable.periodicMessages[variable.periodicMessageIndex]);

            variable.periodicMessageIndex++;

            if (variable.periodicMessageIndex > variable.periodicMessages.length - 1) {
                variable.periodicMessageIndex = 0
            }
        }
    }
}

export { accountageHandler, foreignLanguageHandler, onGoingCommandsHandler, chooseAndSayMessageHandler, tempoFilterHandler, flameHandler }
