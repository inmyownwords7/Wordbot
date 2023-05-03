import dotenv from 'dotenv';
import path, { dirname } from 'path';
import request from 'request';
import { fileURLToPath } from 'url';
import { channelsMap, savedTweet, count } from './Javascript/config.js';
import { authProvider, botUser } from './auth.js';
import { ChatClient } from '@twurple/chat';
import { isStreamOnline, announce } from './Javascript/utils.js';
import { foreignLanguageHandler, onGoingCommandsHandler, chooseAndSayMessageHandler, tempoFilterHandler, flameHandler, accountageHandler } from './Javascript/dynamicCommands.js';
import { variable, time } from './Javascript/Variables.js';
import { loggers, offlineLogger } from './Javascript/LogConfig.js';
import { Group } from './Javascript/Groups.js';
import { colors } from './Javascript/syntax.js';
import { startServer } from './index.js';

startServer();

//User Imports
//Json files
//handlers involving commands that are triggered by !text commands
import {
    clipHandler, timeoutHandler, unbanHandler,
    predictionHandler, toggleSubscriptionHandler, CaptureTextHandler, toggleHandler, systemHandler, generalCommands
    , quoteObject, addCommand, editCommand, delCommand, tempoHandler, flameToggler, toggleTempoHandler
} from "./Javascript/commands.js";

//https://www.npmjs.com/package/chalk to see the chalk color options. 

const rgb = colors.setRGB(100, 203, 0)
const purple = colors.setRGB(127, 0, 255)
const magenta = colors.setRGB(255, 255, 0)
const tweetTimer = 10

//TODO Create a function that tracks how many times a command has been invoked. 

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../env') })

request({
    uri: `https://decapi.me/twitter/latest/iwdominate`,
    method: 'GET'
}, function (err, res, body) {
    if (err) {
        console.log(err);
    }
});

//create objects from classes
export const chat = new ChatClient({
    authProvider: authProvider,
    channels: Array.from(channelsMap.keys()),
    connectionOptions: false,
    webSocket: true,
})

//exports files 
await chat.connect().catch((err) => console.error(err));
chat.onMessage(async function (channel, user, text, msg) {
    console.log(`${time.now}: `, channel, user, text)
    //console.log(now)
    //console.log("This is a channel before channel replace "+channel)
    channel = channel.replace(/#/g, '');

    //console.log("This is a channel after channel replace "+channel)
    let logColor = channelsMap.get(channel).logColor

    if (logColor == "red") {
        offlineLogger.offlineOne.info((`${time.now()} ${channel}: ${user}: ${text}`));
        console.log(colors.red(`${time.now()} ${channel}: ${user}: ${text}`));

    } else if (logColor == "blue") {
        //logger.info(magenta(`${channel}: ${user}: ${text}`));
        //offlineLogger.offlineTwo.info((`${time.now()} ${channel}: ${user}: ${text}`));
        //console.log(colors.blue(`${time.now()} ${channel}: ${user}: ${text}`));
        console.log((`${time.now()} ${channel}: ${user}: ${text}`));
    }

    //tfblade
    else if (logColor == "white") {
        //offlineLogger.info((`${colors.green(channel)}: ${colors.blue(user)}: ${rgb(text)}`));
        offlineLogger.offlineThree.info((`${(channel)}: ${(user)}: ${(text)}`));
    }

    //dom
    else if (logColor == "purple") {
        ///logger.info((`${colors.yellow(channel)}: ${colors.blue(user)}: ${rgb(text)}`));
        //logger.info((`${colors.yellow(channel)}: ${colors.blue(user)}: ${rgb(text)}`));
        offlineLogger.offlineFour.info((`${(channel)}: ${(user)}: ${(text)}`));

    } else if (logColor == "magenta") {
        ((`${channel}: ${user}: ${text}`));
    }

    if (text.includes(`${botUser}`)) {
        console.log(colors.cyan(`${time.now()} ${channel}: ${user} said ${text}`))
    }

    let messageMetaData = {
        //booleans
        //basic permission groups
        isMod: msg.userInfo.isMod,
        isVip: msg.userInfo.isVip,
        isBroadcaster: msg.userInfo.isBroadcaster,
        isParty: Group.includes(user),

        //admin team now including groups
        isStaff: msg.userInfo.isMod || msg.userInfo.isBroadcaster,
        isDeputy: Group.includes(user),
        isEntitled: msg.userInfo.isMod || msg.userInfo.isVip || msg.userInfo.isBroadcaster,
        //can use bot commands at a certain extent.  
        isPermitted: (msg.userInfo.isMod || msg.userInfo.isBroadcaster) && Group.includes(user),
        //broadcasterId
        channelId: msg.channelId,
        userId: msg.userInfo.userId
    }

    /*    console.log(user+" "+msg.userInfo.badges)
   
       console.log(msg.userInfo.badges)
       console.log(msg.userInfo.badges.entries())
       console.log(msg.userInfo.badgeInfo)
   
       console.log(user+" "+msg.userInfo.badges.entries())
       console.log(user+" "+msg.userInfo.badgeInfo)
       console.log(msg.prefixToString) */

    quoteObject.addQuote(channel, user, text, msg, messageMetaData);
    quoteObject.delQuote(channel, user, text, msg, messageMetaData);
    quoteObject.invokeQuote(channel, user, text, msg, messageMetaData);
    quoteObject.editQuote(channel, user, text, msg, messageMetaData);
    await timeoutHandler(channel, user, text, msg, messageMetaData);
    await unbanHandler(channel, user, text, msg, messageMetaData);
    await generalCommands(channel, user, text, msg, messageMetaData);
    await foreignLanguageHandler(channel, user, text, msg, messageMetaData);
    await onGoingCommandsHandler(channel, user, text, msg, messageMetaData);
    await clipHandler(channel, user, text, msg, messageMetaData);
    await predictionHandler(channel, user, text, msg, messageMetaData);
    await toggleSubscriptionHandler(channel, user, text, msg, messageMetaData);
    await CaptureTextHandler(channel, user, text, msg, messageMetaData);
    toggleHandler(channel, user, text, msg, messageMetaData);
    await tempoFilterHandler(channel, user, text, msg, messageMetaData);
    tempoHandler(channel, user, text, msg, messageMetaData);
    await systemHandler(channel, user, text, messageMetaData);
    addCommand(channel, user, text, msg, messageMetaData);
    delCommand(channel, user, text, msg, messageMetaData);
    editCommand(channel, user, text, msg, messageMetaData);
    await flameToggler(channel, user, text, msg, messageMetaData);
    await flameHandler(channel, user, text, msg, messageMetaData);
    await toggleTempoHandler(channel, user, text, msg, messageMetaData);
    await accountageHandler(channel, user, text, msg, messageMetaData);

    if (text === `!quit` && messageMetaData.isMod) {
        chat.quit()
    }
});

//Events
const giftCounts = new Map();
chat.onSub((channel, user) => {
    if (isStreamOnline(channel)) {
        channel = channel.replace("#", "");
        let subs = channelsMap.get(channel).subCounter++;
        if (channelsMap.get(channel).shouldThankSubscription) {
            chat.say(channel, `Thanks to @${user} for subscribing to the channel!`);
            loggers.syslogs.info(colors.system(`number of subs is: ${subs} in channel: #${channel}`))
        }
    }
});

chat.onResub((channel, user, subInfo) => {
    if (isStreamOnline(channel)) {
        channel = channel.replace("#", "");
        let subs = channelsMap.get(channel).subCounter++;
        count.get(channel).set("Total Gifts", subs)
        if (channelsMap.get(channel).shouldThankSubscription) {
            chat.say(channel, `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`);
            loggers.syslogs.info(colors.system(`number of subs is: ${subs} in channel: ${channel}`))
        }
    }
});

chat.onCommunitySub((channel, user, subInfo) => {
    if (isStreamOnline(channel)) {
        channel = channel.replace("#", "");
        let subs = channelsMap.get(channel).subCounter++;
        count.get(channel).set("Total Gifts", subs)
        if (channelsMap.get(channel).shouldThankSubscription) {
            const previousGiftCount = giftCounts.get(user) ?? 0;
            giftCounts.set(user, previousGiftCount + subInfo.count);
            chat.say(channel, `Thanks ${user} for gifting ${subInfo.count} subs to the community!`)
            loggers.syslogs.info(colors.system(`number of subs is: ${subs} in channel: ${channel}`))
        }
    }
});

//chat.reconnect()
chat.onSubGift((channel, recipient, subInfo) => {
    if (isStreamOnline(channel)) {
        channel = channel.replace("#", "");
        if (channelsMap.get(channel).shouldThankSubscription) {
            let subs = channelsMap.get(channel).subCounter++;
            const user = subInfo.gifter;
            const previousGiftCount = giftCounts.get(user) ?? 0;
            if (previousGiftCount > 0) {
                giftCounts.set(user, previousGiftCount - 1);
            } else {
                chat.say(channel, `Thanks ${user} for gifting a sub to ${recipient}!`);
                loggers.syslogs.info(colors.system(`number of subs is: ${subs} in channel: ${channel}`))
            }
        }
    }
});

chat.onAuthenticationFailure((text, retryCount) => { /* ... */
    console.log(`${text}, has attempted authentication: ${retryCount} times.`)
});

chat.onBan((channel, user, msg) => {
    channel = channel.replace("#", "")
    let banCounts = channelsMap.get(channel).banCount++;
    loggers.syslogs.info(colors.error(`${user} was banned from ${channel} on ${time.now()}`))
    loggers.syslogs.info(colors.error(`number of banned is: ${banCounts} in channel: ${channel}`))
});

chat.onAuthenticationSuccess(() => {
    //this only works because bot starting time is static. 
    let startTime = time.localTime;
    loggers.syslogs.info(colors.system("Bot has started on " + startTime))
    loggers.syslogs.info(colors.system("Successfully registered!"))
    loggers.syslogs.info(colors.system("Listening for channel changes. "))

    setInterval(() => {
        chooseAndSayMessageHandler()
    }, (variable.onlineMessageInterval * variable.m))//every 20 min

    //call systemHandler here to restart bot in case of crash or disconnect. 
    setInterval(() => {
        checkForAndAnnounceNewTweet()
    }, (tweetTimer * variable.m))//every 10 sec
    reset();
});

chat.onChatClear((channel, msg) => {
    //console.log(colors.error(`a moderator in ${channel} has cleared the chat with ${msg.command} at ${msg.date}`))
    loggers.syslogs.info(colors.error(`a moderator in ${channel} has cleared the chat with ${msg.command} at ${time.now()}`))
});

chat.onPart((channel, user) => {
    console.log(channel, user)
});

chat.onWhisper((user, text, msg) => {
    let messageMetaData = {
        //booleans
        isMod: msg.userInfo.isMod,
        isVip: msg.userInfo.isVip,
        isBroadcaster: msg.userInfo.isBroadcaster,
        isParty: Group.includes(user),
        isStaff: msg.userInfo.isMod || msg.userInfo.isBroadcaster,

        //broadcasterId
        isDeputy: Group.includes(user)
    }

    Loggers.dmLogger.info(colors.cyan(`${time.now()}: ${user}: said ${text}`));
    timeoutHandler(null, user, text, msg, messageMetaData);
    unbanHandler(null, user, text, msg, messageMetaData);
});

chat.onTimeout((channel, user, duration) => {
    channel = channel.replace("#", "");
    let tCount = channelsMap.get(channel).timeCounter++;
    loggers.syslogs.info(colors.error(`${user} was timed out for ${duration} seconds from ${channel}`))
    loggers.syslogs.info(colors.error(`Number of timeouts is: ${tCount} for channel: ${channel}`))
});

chat.onSubsOnly((channel, enabled) => {
    console.log(`${channel} has enabled submode ${enabled}`)
});

chat.onSubExtend((channel, user, subInfo, msg) => {
    console.log(channel, user, subInfo)
});

chat.onSlow((channel, enabled, delay) => {
    console.log(channel, enabled, delay)
});

chat.onRitual((channel, user, ritualInfo, msg) => { /* ... */
    console.log(channel, user, ritualInfo, msg)
});

chat.onRewardGift((channel, user, rewardGiftInfo, msg) => { /* ... */
    console.log(`${user} has received ${rewardGiftInfo} in ${channel}`)
});

chat.onRaidCancel((channel, msg) => { /* ... */
    console.log(`${channel} has cancelled ${msg.id}`)
});

chat.onRaid((channel, user, raidInfo) => { /* ... */
    console.log(channel, user, raidInfo)
    chat.say(channel, `thank you @${raidInfo.displayName} for the raid of ${raidInfo.viewerCount} raiders!`)
});

chat.onR9k((channel, enabled) => { /* ... */
    console.log(colors.system(channel, enabled))
});

chat.onPrimePaidUpgrade((channel, user, subInfo, msg) => { /* ... */
    console.log(channel, user, subInfo)
});

chat.onMessageRemove((channel, messageId, msg) => {
    channel = channel.replace("#", "");
    let mCount = channelsMap.get(channel).messageDeletedCounter++;
    loggers.syslogs.info(colors.error(`${channel} ${msg.userName} message in ${channel} was deleted`))
    loggers.syslogs.info(colors.error(`number of messaged removed in ${channel} is: ${mCount} messages`))
});

chat.onMessageRatelimit((channel, text) => { /* ... */
    console.log(channel, text)
});

chat.onMessageFailed((channel, reason) => { /* ... */
    console.log(channel, reason)
});

chat.onJoin((channel, user) => { /* ... */
    console.log(colors.system(`${time.now()} ${user} has joined ${channel}`));
});

chat.onFollowersOnly((channel, enabled, delay) => {
    console.log(channel, enabled, delay)
});

chat.onEmoteOnly((channel, enabled) => { /* ... */
    console.log(channel, enabled + "")
});

chat.onR9k((target, user, command, params, msg) => { /* ... */
    console.log(target, user, command, params, msg)
});

chat.onCommunityPayForward((target, user, command, params, msg) => { /* ... */
    console.log(target, user, command, params, msg)
});

//constantly check whether it's active or not. if It is it will start if not it won't. If it's active it will check if the string is is identical or not.

chat.onTokenFetchFailure((error) => {
    console.log(error + " failed to fetch a token, contact your system administrator for more information. ")
});

chat.onNoPermission((channel, text) => { /* ... */
    console.log("You do have sufficient permission to perform this command in " + channel + text)
});

function checkForAndAnnounceNewTweet() {
    try {
        request({
            uri: `https://decapi.me/twitter/latest/iwdominate`,
            method: 'GET'
        }, async function (err, res, body) {
            if (err) {
                console.log(err);
                return;
            }

            if (savedTweet.savedTweet !== body && await isStreamOnline("iwdominate")) {
                announce("iwdominate", "announcing new tweet " + body)
                console.log("announcing new tweet");
            }
            savedTweet.savedTweet = body;
        });

    } catch (error) {
        console.error(error)
    }
}

function reset() {
    let date = new Date();
    let midnight = date.setHours(24, 0, 0, 0);
    // let midnight = date.getTime() + 1 * 1000 * 60; //test with one minute if needed
    let countdown = midnight - new Date().getTime();

    setTimeout(() => {
        resetCount()
        console.log(countdown)
    }, countdown)
}

function resetCount() {
    console.log("Reset working!")
    Array.from(channelsMap.keys()).forEach(channelName => {
        channelsMap.get(channelName).banCount = 0;
        channelsMap.get(channelName).messageDeletedCounter = 0;
        channelsMap.get(channelName).timeCounter = 0;
        channelsMap.get(channelName).subCounter = 0;
    });
    reset();
}