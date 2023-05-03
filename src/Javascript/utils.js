
import { botId, authProvider } from "../auth.js";
import { ApiClient } from '@twurple/api';

const api = new ApiClient({ authProvider: authProvider })

export const moderateApi = api.moderation;
export const chatApi = api.chat;
export const streamApi = api.streams;
export const whisperApi = api.whispers;
export const userApi = api.users;
export const clipApi = api.clips;
export const predictionApi = api.predictions;
export const eventApi = api.eventSub;
export const channelApi = api.channels;

async function extractIdFromUser(user) {
  // if (user) {
  let userResult = await userApi.getUserByName(user);
  //console.log(user + " resolves to " + userResult.id)
  return userResult.id;
  //}
}

async function HelixUserDate(user) {
  let userResult = await userApi.getUserByName(user);
  return userResult.creationDate;
}

async function banUser(channel, user, number, explanation) {
  //console.log(channel, user)
  console.log("params:", channel, user, number, explanation)
  let channelId = await extractIdFromUser(channel);
  let user_Id = await extractIdFromUser(user);

/*   if (await checkUserBan(channelId, user_Id)) {
    console.log("not banning cause user already banned");
    return
  } */

  console.log("ids:", channelId, user_Id)
  try {
    //console.log("user_Id", user_Id, "channelId", channelId)
    if (number === "perm") {
      number = null;
    }

    console.log(`Supposed parameters for the command is ${channelId} ${user_Id}`)
    moderateApi.banUser(channelId, botId,
      {
        duration: number,
        reason: explanation,
        user: user_Id
      })
  } catch (error) {
    console.error(error)
  }
}

async function checkUserBan(channelId, userId) {
  console.log(channelId, userId)
  return await moderateApi.checkUserBan(channelId, userId);
}

//user is considered the person being timed out. 
async function banMultipleUsers(channel, user, number, explanation) {
  user.forEach(async user => {
    let user_Id = await extractIdFromUser(user);
    let channelId = await extractIdFromUser(channel);

    if (number === "perm") {
      number = null;
    }

    return await moderateApi.banUser(channelId, botId, { duration: number, reason: explanation, userId: user_Id })
  });
}

function stripMessageOfMentions(text) {
  let newMessage = "";
  let shouldInclude = true;
  try {
    for (let char of text) {

      if (char === "@") {
        shouldInclude = false;

      }

      if (char === "") {
        shouldInclude = true;
      }

      if (shouldInclude) {
        newMessage += char;
      }
    }
    return newMessage;
  } catch (error) {
    console.error(error)
  }
}

function getChannelResponses(channel, channels) {
  return channels.filter((channel) => {
    if (channel.channel === channel)
      return true;
  })
}
// @Comment: Comment
async function removeBlockedWord(channel, id) {
  //id in this case is the word you want to remove.
  let channelId = await extractIdFromUser(channel);
  return await moderateApi.removeBlockedTerm(channelId, botId, id)
}

async function addBlockedTerm(channel, id) {
  //id is the word you want to add to the channel. 
  let channelId = await extractIdFromUser(channel);
  return await moderateApi.addBlockedTerm(channelId, botId, id)
}

async function getBlockedTerms(channel, after, limit) {
  let pagination = { after, limit }
  let channelId = await extractIdFromUser(channel)
  return await moderateApi.getBlockedTerms(channelId, botId, pagination)
}

async function deleteWord(channel, msg) {
  let channelId = await extractIdFromUser(channel)
  return await moderateApi.deleteChatMessages(channelId, botId, msg.id)
}

async function whispers(userName, text) {
  let userId = await extractIdFromUser(userName);
  return await whisperApi.sendWhisper(botId, userId, text)
}

async function createClip(channel, createAfterDelay) {
  try {
    channel = channel.replace(/#/g, '')
    let channelId = await extractIdFromUser(channel);
    console.log("id result", channelId)

    return await clipApi.createClip({ channel: channelId, createAfterDelay: createAfterDelay })
  } catch (error) {
    console.error(error)
  }
}

async function getClip(id) {
  return await clipApi.getClipById(id)
}

//TODO Predictions contains issues. Awaiting help from support group. 
async function createPrediction(broadcaster, duration, title) {
  let broadcaster_id = await extractIdFromUser(broadcaster)
  return await predictionApi.createPrediction(broadcaster_id, { autoLockAfter: duration, outcomes: [], title: title })
}

async function getPredictions(broadcaster) {
  let broadcasterId = await extractIdFromUser(broadcaster)
  let id = getPredictionById(id)
  return await predictionApi.getPredictions(broadcasterId, id)
}

async function cancelPrediction(broadcaster) {
  let broadcasterId = await extractIdFromUser(broadcaster)
  let id = getPredictionById(id)
  return await predictionApi.cancelPrediction(broadcasterId, id)
}

async function resolvePredictions(broadcaster, outcomeId) {
  let broadcasterId = await extractIdFromUser(broadcaster)
  let id = getPredictionById(id)
  //outcomeId win or lose;
  return await predictionApi.resolvePrediction(broadcasterId, id, outcomeId)
}

//commands are in global cooldown restricts how often commands procs. 
function cooldown() {
  if (new Date().getTime() - timeLastSentTimeoutMessage > 600) {
    // TODO document why this block is empty

  } else {
    // TODO document why this block is empty

  }
}

function isOffCooldown(lastResponseTime, cooldownDuration) {
  if (user.toLowerCase() === "trtld") {
    return true;
  }

  let timeSinceLastResponse = new Date().getTime() - lastResponseTime;
  if (timeSinceLastResponse > cooldownDuration) {
    return true;
  }
}

async function isStreamOnline(channel) {
  try {
    channel = channel.replace(/#/g, '')
    const broadcasterId = await extractIdFromUser(channel)
    let stream = await streamApi.getStreamByUserId(broadcasterId);
    return stream?.startDate ? true : false
  } catch (error) {
    console.error(error)
  }
}

async function getCurrentCategory() {
  // TODO document why this async function 'getCurrentCategory' is empty


}

//replace command with the string of !{rest of command}
//takes !command and text remains text. 
function isCommand(command, text) {
  if (text.substring(0, command.length) === command) {
    let args = text.substring(command.length + 1, text.length).split(" ");
    return args ? args : true;
  }
  return false;
}

async function announce(channel, announcement) {
  let channelId = await extractIdFromUser(channel)
  return await chatApi.sendAnnouncement(channelId, botId, { color: null, message: announcement })

}

async function checkUserVipOrModerator(channel, user) {
  let channelId = await extractIdFromUser(channel);
  let user_Id = await extractIdFromUser(user);
  return await channelApi.checkVipForUser(channelId, user_Id)
}

export {
  extractIdFromUser, banUser, banMultipleUsers, stripMessageOfMentions,
  getChannelResponses, removeBlockedWord,
  deleteWord, getBlockedTerms, addBlockedTerm,
  whispers, createClip, getClip,
  createPrediction, getPredictions, cancelPrediction,
  resolvePredictions, cooldown, isOffCooldown,
  isStreamOnline, announce, isCommand, checkUserVipOrModerator, checkUserBan, HelixUserDate
} 