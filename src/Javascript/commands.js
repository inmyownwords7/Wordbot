//*Command handler codes are written here and then exported into app.js
//*IMPORTS ONLY
import { chat } from '../app.js';
import { createClip, banUser, banMultipleUsers, extractIdFromUser, whispers, isCommand, moderateApi, predictionApi } from './utils.js'
import { filteredwords, tempowords, commands, banQueue, quotes, channelsMap } from "./config.js";
import { loggers } from './LogConfig.js';
import { colors } from "./syntax.js";
import { Group } from "./Groups.js"

//*EXPORTS ONLY
let toggleLog = true;
//let syslogs = logger;
//--------------------------------------
//
//command handler funcs
//
//-------------------------------------------------
export function toggleHandler(channel, user, text, msg, messageMetaData) {

    if (text === `!disabletoggle` && messageMetaData.isStaff) {
        console.log(colors.system("autoMessage has been turned off. "))
        toggleLog = false;
    } else if (text === `!enabletoggle` && messageMetaData.isStaff) {
        console.log(colors.system("autoMessage has been turned on. "))
        toggleLog = true
            channelsMap.get(channel).isForeignEnabled = true,
            channelsMap.get(channel).isFlamingEnabled = true;
    }
}

export async function flameToggler(channel, user, text, msg, messageMetaData) {
    channel = channel.replace('#', '')

    let flameToggle = isCommand('!enableflame', text)
    if (flameToggle && messageMetaData.isStaff) {
        channelsMap.get(channel).isFlamingEnabled = true;
        chat.say(channel, `PREPARING PURGE MODE (I'M A BOT) MrDestructoid`)
        console.log("enable flame typed")
    }

    flameToggle = isCommand('!disableflame', text)
    if (flameToggle && messageMetaData.isStaff) {
        channelsMap.get(channel).isFlamingEnabled = false;
        chat.say(channel, `DISABLING PURGE MODE (I'M A BOT) MrDestructoid`)
        console.log("disable flame typed")
    }
}

export async function toggleTempoHandler(channel, user, text, msg, messageMetaData) {
    channel = channel.replace('#', '')

    let tempoToggle = isCommand('!enabletempo', text)
    if (tempoToggle && messageMetaData.isStaff) {
        channelsMap.get(channel).toggleTempo = true;
        //chat.say(channel, `PREPARING PURGE MODE (I'M A BOT) MrDestructoid`)
        console.log("enable flame typed")
    }

    tempoToggle = isCommand('!disabletempo', text)
    if (tempoToggle && messageMetaData.isStaff) {
        channelsMap.get(channel).toggleTempo = false;
        //chat.say(channel, `DISABLING PURGE MODE (I'M A BOT) MrDestructoid`)
        console.log("enable temp typed")
    }
}

export async function toggleSubscriptionHandler(channel, user, text, msg, messageMetaData) {
    if (text === `!disableNotifications` && messageMetaData.isPermitted) {
        // TODO document why this block is empty

    } else if (text === `!enableNotifications` && messageMetaData.isStaff) {
        // TODO document why this block is empty
    }
}

export async function timeoutHandler(channel, user, text, msg, messageMetaData) {
    let isTimeoutCommand = isCommand("!timeout", text);
    try {
        if (isTimeoutCommand) {
            if (messageMetaData.isStaff || messageMetaData.isParty || messageMetaData.isDeputy) {

                let args = isTimeoutCommand;
                //syslogs.info(colors.command(`${channel}: ${user}: ${text}`))
                // console.log(channelId + " " + args[0])

                //console.log("timeout args: ", args[0], args[1], args[2], args[3])

                let reason = args.slice(3, args.length).join(" ").replace("#", "");
                //!timeout [channel] [user] [duration] [reason]
                console.log("Checking for possible error by checking values of:" + reason)

                if (!Group.includes(args[0].toLowerCase())) {
                    if (args.length === 1) {
                        loggers.logger.notice(colors.cyan(`${user} timed out args[0].toLowerCase() for 60 seconds in ${channel}`))
                        banUser(channel, args[0], 60, "Timed out by deputy moderator.")
                    } else {
                        banUser(args[0], args[1], args[2], reason)
                    }
                } else {
                    console.log(channel + `${args[0].toLowerCase()} is immune from deputy timeouts.`)
                    chat.say(channel, `${args[0].toLowerCase()} is immune from deputy timeouts.`)
                }
                loggers.syslogs.info(colors.command(args[0], args[1], args[2], reason))
            }
        }
    }
    catch (err) {
        console.error(err)
    }
}

export async function unbanHandler(channel, user, text, msg, messageMetaData) {
    if (text.substring(0, `!unban`.length) === `!unban` && messageMetaData.isStaff) {
        let args = text.split(" ");

        console.log(args[1])

        console.log(args[2])

        let channelId = await extractIdFromUser(args[1]);
        let userId = await extractIdFromUser(args[2]);
        loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`))
        await moderateApi.unbanUser(channelId, botId, userId)
    }
}

export async function clipHandler(channel, user, text, msg, messageMetaData) {
    if (text === `!clip` && messageMetaData.isStaff) {
        let reClip = await createClip(channel, false)
        loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`))
        //clipLog.info(`${channel}: clip ${reClip} generated by ${user}`)
        await say(channel, `@${user} Here's your clip <3 <3 ${reClip}`);
    }
}

//!prediction title win lose duration
export async function predictionHandler(channel, user, text, msg, messageMetaData) {
    if (text.substring(0, `!prediction`.length) === `!prediction` && messageMetaData.isStaff) {

        let channelId = await extractIdFromUser(channel);

        let args = text.split(" ");

        let lockAfter = 100;

        if (args.length > 4) {
            lockAfter = args[4]
        }
        
        loggers.syslogs.info(colors.command(`${channel}: ${user}: ${text}`))
        predictionApi.createPrediction(channelId, { autoLockAfter: lockAfter, outcomes: [args[2], args[3]], title: args[1] });
    }
}

export async function CaptureTextHandler(channel, user, text, msg, messageMetaData) {

    if (text.substring(0, `!recordphrase `.length) === `!recordphrase ` && (messageMetaData.isStaff)) {
        let args = text.split(" ");
        //returns word after record
        let bannedPhrase = args.slice(1, args.length).join(" ");
        banQueue.get(channel).set(bannedPhrase, []);//new filter being recorded now
        loggers.syslogs.info(colors.command(channel, "Now recording uses of \"" + bannedPhrase + "\""))
        chat.say(channel, "Now recording uses of \"" + bannedPhrase + "\"")
    }

    if (text.substring(0, `!amount `.length) === `!amount ` && (messageMetaData.isStaff)) {
        let args = text.split(" ");
        let bannedPhrase = args.slice(1, args.length).join(" ");
        let usersToBan = banQueue.get(channel).get(bannedPhrase);
        if (usersToBan) {
            loggers.syslogs.info(colors.command(channel, "currently " + usersToBan.length + " victims"))
            chat.say(channel, "currently " + usersToBan.length + " victims")
        }
        else {
            loggers.syslogs.info(colors.command(channel, "Not currently recording that phrase. Use !recordphrase " + bannedPhrase + " to start recording."))
            chat.say(channel, "Not currently recording that phrase. Use !recordphrase " + bannedPhrase + " to start recording.")
        }
    }

    if (text.substring(0, `!clearphrase `.length) === `!clearphrase ` && (messageMetaData.isStaff)) {
        let args = text.split(" ");
        let bannedPhrase = args.slice(1, args.length).join(" ");
        banQueue.get(channel).delete(bannedPhrase);//new filter being recorded now
        loggers.syslogs.info(colors.command(channel, "Successfully cleared recorded phrase."))
        chat.say(channel, "Successfully cleared recorded phrase.")
    }

    if (text.substring(0, `!purge `.length) === `!purge ` && (messageMetaData.isStaff)) {
        let args = text.split(" ");
        let bannedPhrase = args.slice(1, args.length).join(" ");
        let usersToBan = banQueue.get(channel).get(bannedPhrase);
        if (usersToBan) {
            banMultipleUsers(channel, usersToBan, 1, "I WARNED YOU FOOLS I WILL RETURN A SUPRISE!!!!!!!!!!!!!!!! timed out for typing " + bannedPhrase)
            chat.say(channel, "bye RIPBOZO")
        }
    }

    if (text === `!checkfilteredwords` && messageMetaData.isStaff) {
        whispers(`${user}`, ` The followings words are: [${filteredwords}]`)
    }

    //can use this to test stuff
}

export function tempoHandler(channel, user, text, msg, messageMetaData) {
    if (text.toLowerCase() === `!checkwords` && messageMetaData.isStaff) {
        let whisperMessage = "";
        Array.from(tempowords.keys()).forEach(channel => {
            whisperMessage += channel + ": \n";
            whisperMessage += `${tempowords.get(channel)}`
            whisperMessage += " \n"
        });
        whispers(user, whisperMessage);
    }

    let messageSlicer = (text.toLowerCase().slice(0, `!tempo add`.length));
    if (messageSlicer === `!tempo add` && messageMetaData.isStaff) {
        console.log("working")
        let wordToAdd = text.slice(`!tempo add`.length + 1, text.length);
        if (wordToAdd) {
            loggers.syslogs.info(colors.command(channel, `The word ${wordToAdd} has been added.`))
            chat.say(channel, `The word ${wordToAdd} has been added.`)
            tempowords.get(channel).push(wordToAdd)
            loggers.syslogs.info(colors.command(wordToAdd + ' was added into the array ' + ' is the new array: ' + tempowords.get(channel)));
        }
    }

    let tempoRemoveSlicer = (text.toLowerCase().slice(0, `!tempo remove`.length));

    if (tempoRemoveSlicer === `!tempo remove` && messageMetaData.isStaff) {
        let wordToRemove = text.slice(`!tempo remove`.length + 1, text.length) //returns test
        let indexRemoveSlice = tempowords.get(channel).indexOf(wordToRemove) //returns the position of test in the array.
        if (indexRemoveSlice > -1) {
            tempowords.get(channel).splice(indexRemoveSlice, 1); //removes the word test from the array and returns the word.
            loggers.syslogs.info(colors.command(channel, `@${user} ` + `The word ${wordToRemove} has been removed.`))
            chat.say(channel, `@${user} ` + `The word ${wordToRemove} has been removed.`)


            loggers.syslogs.info(colors.command(wordToRemove + ' was removed from the array ' + 'the new array is: ' + tempowords.get(channel)));
        }
        else {
            loggers.syslogs.info(colors.command(channel, `@${user} ` + `The word ${wordToRemove} is not being filtered, can't remove.`))
            chat.say(channel, `@${user} ` + `The word ${wordToRemove} is not being filtered, can't remove.`)
        }
    }
}

export async function systemHandler(channel, user, text, messageMetaData) {
    //!shutdown the bot completely. 
    if (text === `!shutdown` && messageMetaData.isStaff && user === 'woooordbot') {
        loggers.syslogs.info(colors.command(`Forced Shutdown initiated in ${channel} by ${user}`))
        chat.quit()
        //!part implies leaving a channel, parameter is !part #channel. channel === channel means it can only be used in the same channel
    } else if (text === `!part` && messageMetaData.isStaff && channel === channel) {
        loggers.syslogs.info(colors.command(`Now leaving ${channel} command by ${user}`))
        chat.part(channel)
    } else if (text === `!join` && messageMetaData.isStaff) {
        if (text.substring(0, `!join `.length) === `!join ` && (messageMetaData.isStaff)) {
            let args = text.split(" ");
            channel = args.slice(1, args.length).join(" ");
            loggers.syslogs.info(colors.command(`${user} is now joining ${args[1]}`))
            chat.join(channel)
        }
    }
}

export async function tweetHandler(channel, user, text, messageMetaData) {
    let param = isCommand("!tweet", text)
    if (param && messageMetaData.isStaff) {
        let args = param;
        request({
            uri: `https://decapi.me/twitter/latest/${args[0]}`,
            method: 'GET'
        }, async function (err, res, body) {
            if (err) {
                console.log(err);
            }
            chat.say(channel, `${body}`)
        });
    }
}

//----------------------------------
//
//util funcs
//
//--------------------------------------------

export async function generalCommands(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!status", text)
    //Displays whether bot is online or not.
    if (param && messageMetaData.isStaff) {
        await chat.say(channel, "Wordbot is currently online MrDestructoid")
    }
    //informs of count of banned
    let start = new Date
}

export function addCommand(channel, user, text, msg, messageMetaData) {
    //console.log(text)
    let param = isCommand("!addorder", text);
    //console.log(param)
    if (param && messageMetaData.isStaff) {
        //if param is greater or equal to 2 such as !addcom !command content is true
        if (param.length >= 2) {
            console.log(param)
            let newCommandResponse = param.slice(1).join(" ")
            loggers.syslogs.info(colors.command(channel, `${param[0]} has been added. as an command`))
            chat.say(channel, `${param[0]} has been added. as an command`)
            commands.get(channel).set(param[0], newCommandResponse)
        }
    }
}

export function delCommand(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!delorder", text);
    //if isCommand is true
    if (param && messageMetaData.isStaff) {
        console.log("result of commands.get(channel).get(param[0])", commands.get(channel).get(param[0]))
        //if !delorder !content
        if (param.length == 1 && commands.get(channel).get(param[0])) {
            chat.say(channel, `${param[0]} has been deleted.`)
            commands.get(channel).delete(param[0]);
        }
        else {
            chat.say(channel, `The order you're trying to delete does not exist.`)
        }
    }
}

export function editCommand(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!editorder", text)
    if (param && messageMetaData.isStaff) {
        if (param.length >= 2 && commands.get(channel).get(param[0])) {
            console.log(param.length >= 2)
            if (commands.get(channel).get(param[0])) {
                let newCommandResponse = param.slice(1).join(" ")
                commands.get(channel).set(param[0], newCommandResponse)
            } else {
                chat.say(channel, "command does not exist")
            }
        }
    }

    let response = commands.get(channel).get(text)
    if (response) {
        chat.say(channel, response)
    }
}

//0 is !addcom, 1 is !something, 2 is the rest 
export const quoteObject = { addQuote, delQuote, editQuote, invokeQuote }

function addQuote(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!addquote", text);
    //console.log(isCommand("!addquote", text))
    if (param && messageMetaData.isStaff) {
        if (param.length >= 1) {
            let quote = param.join(" ")
            quotes.get(channel).push(quote);
            chat.say(channel, `Quote #${quotes.get(channel).length} added.`)
        }
    }
}

function delQuote(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!delquote", text);
    //if isCommand is true
    if (param && messageMetaData.isStaff) {
        //if !delorder !content
        if (param.length == 1 && !isNaN(param[0]) && quotes.get(channel).length > param[0]) {
            //chat.say(channel, `${param[0]} has been deleted.`)
            let arr = quotes.get(channel)
            //arr.splice returns a copy, does not modify original array. if you want it to modify original you need to set arr = to the copy it creates
            arr = arr.splice(param[0], 1)
            //arr.indexOf(param[0]) this no just param 0. user types !delquote 1, 1 is already the index you don't need to do anything more
            quotes.set(channel, arr)
            chat.say(channel, `Quote deleted.`)
        }
        else {
            chat.say(channel, `The quote you're trying to delete does not exist. Please enter the index of the quote.`)
        }
    }
}

function editQuote(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!editquote", text)
    if (param && messageMetaData.isStaff) {
        //quotes.get(channel).get(param[0]) it's not a map with a map, it's a map with an array
        if (param.length >= 2 && !isNaN(param[0]) && quotes.get(channel).length > param[0]) {
            quotes.get(channel)[param[0]] = param.slice(1).join(" ");
            chat.say(channel, `Quote #${quotes.get(channel).length} edited.`)
        }
        else {
            chat.say(channel, `The quote you're trying to edit does not exist. Please enter the index of the quote.`)
        }
    }
}

function invokeQuote(channel, user, text, msg, messageMetaData) {
    let param = isCommand("!quote", text)
    if (param && messageMetaData.isStaff) {
        let index = param[0];
        //console.log(param)
        if (param[0] === '') {
            index = Math.floor(Math.random() * quotes.get(channel).length);
        }
        if (!isNaN(index) && quotes.get(channel).length > index) {
            chat.say(channel, `Quote #${index}: ${quotes.get(channel)[index]}`);
        }
        else {
            chat.say(channel, `That quote doesn't exist`)
        }
    }
}