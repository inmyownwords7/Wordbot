import fs from "fs";

export {
  filteredwords, tempowords, permaban, timeoutHistory,
  redArray, blueArray, banQueue, rouletteCountHistory, count, channels, savedTweet, commands, quotes, channelsMap
}

//pathToFileURL()
let channelsMap = new Map();
let filteredwords = [];
let savedTweet = { savedTweet: "" }
let tempowords = new Map();
let commands = new Map();
let quotes = new Map();
let timeoutHistory = new Map();
let banQueue = new Map();
let rouletteCountHistory = new Map();
let count = new Map();

let permaban = [];
let redArray = [];
let blueArray = [];
let channels = [
  { channelName: "tfblade" },
  { channelName: "iwdominate" },
  { channelName: "perkz_lol" },
  { channelName: "akanemsko" }];
/*
TODO Toggle chat logging. For example enable blade or enable Dom. Toggles are with booleans.
*/
function setupConfig() {
  if (!fs.existsSync("./jsonFiles/filterwords.json")) {
    //first time running program, create file.
    fs.writeFile('./jsonFiles/filterwords.json', JSON.stringify({ filteredwords: [] }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/filterwords.json');
    filteredwords = JSON.parse(rawdata).filteredwords;
  }

  if (!fs.existsSync("./jsonFiles/responses.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/responses.json', JSON.stringify({ channels: [{ channelName: "tfblade" }, { channelName: "iwdominate" }, { channelName: "perkz_lol" }, { channelName: "akanemsko" }] }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/responses.json');
    channels = JSON.parse(rawdata).channels;
  }

  if (!fs.existsSync("./jsonFiles/tempo.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/tempo.json', JSON.stringify({ tempowords: tempowords }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/tempo.json');
    tempowords = JSON.parse(rawdata, jsonReviver).tempowords;
  }

  if (!fs.existsSync("./jsonFiles/channelData.json")) {
    channels.forEach(channelEntry => {

      let channelColors = {
        tfblade: "green",
        iwdominate: "blue"
        //etc finish this
      }

      let account = {
        akanemsko: false,
        tfblade: true,
        iwdominate: true
      }

      //will set everything to default, except since log colors are diff for each channel, it will choose correct log color from channelColors
      channelsMap.set(channelEntry.channelName, {
        isForeignEnabled: true,
        shouldThankSubscription: false,
        toggleLog: true,
        logColor: channelColors[channelEntry.channelName],
        isFlamingEnabled: false,
        toggleTempo: false,
        banCount: 1,
        messageDeletedCounter: 1,
        timeCounter: 1,
        subCounter: 1,
        accountUserAge: account[channelEntry.channelName]
      });
    });

    fs.writeFile('./jsonFiles/channelData.json', JSON.stringify({ channelsMap: channelsMap }, jsonReplacer), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/channelData.json');
    channelsMap = JSON.parse(rawdata, jsonReviver).channelsMap;
  }

  Array.from(channelsMap.keys()).forEach(channelName => {
    tempowords.set(channelName, []);
  });

  Array.from(channelsMap.keys()).forEach(channelName => {
    banQueue.set(channelName, new Map());
  });

  Array.from(channelsMap.keys()).forEach(channelName => {
    commands.set(channelName, new Map());
  });

  Array.from(channelsMap.keys()).forEach(channelName => {
    quotes.set(channelName, []);
  });

  Array.from(channelsMap.keys()).forEach(channelName => {
    count.set(channelName, new Map());
  });

  if (!fs.existsSync("./jsonFiles/commands.json")) {
    //first time running program, create file.

    //fs.writeFile('./jsonFiles/commands.json', JSON.stringify([{ commands: commands }, {quotes: quotes}]), error => {
    fs.writeFile('./jsonFiles/commands.json', JSON.stringify([{ commands: commands, quotes: quotes }]), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/commands.json');
    commands = JSON.parse(rawdata, jsonReviver).commands;
    quotes = JSON.parse(rawdata, jsonReviver).quotes;
  }

  if (!fs.existsSync("./jsonFiles/Predictions.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/Predictions.json', JSON.stringify({ redArray: [], blueArray: [] }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/Predictions.json');
    redArray = JSON.parse(rawdata).redArray;
    blueArray = JSON.parse(rawdata).blueArray;
  }

  if (!fs.existsSync("./jsonFiles/permabanned.json")) {
    fs.writeFile('./jsonFiles/permabanned.json', JSON.stringify({ permaban: [] }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/permabanned.json');
    permaban = JSON.parse(rawdata).permaban;
  }

  if (!fs.existsSync("./jsonFiles/filters.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/filters.json', JSON.stringify({ banQueue: banQueue }, jsonReplacer), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {

    let rawdata = fs.readFileSync('./jsonFiles/filters.json');
    banQueue = JSON.parse(rawdata, jsonReviver).banQueue;
  }

  if (!fs.existsSync("./jsonFiles/roulette.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/roulette.json', JSON.stringify({ rouletteCountHistory: new Map() }, jsonReplacer), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {

    let rawdata = fs.readFileSync('./jsonFiles/roulette.json');
    rouletteCountHistory = JSON.parse(rawdata, jsonReviver).roulette;
  }

  if (!fs.existsSync("./jsonFiles/Jail.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/Jail.json', JSON.stringify({ timeoutHistory: new Map() }, jsonReplacer), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/Jail.json');
    timeoutHistory = JSON.parse(rawdata, jsonReviver).timeoutHistory;
  }
  //timeoutHistory: [{ channelName: "tfblade" }, { channelName: "iwdominate" }, { channelName: "perkz_lol" }, { channelName: "akanemsko" }]
  setInterval(periodicallySaveChannelData, 60000);

  if (!fs.existsSync("./jsonFiles/count.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/count.json', JSON.stringify({ count: count }, jsonReplacer), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/count.json');
    count = JSON.parse(rawdata, jsonReviver).count;
  }

  if (!fs.existsSync("./jsonFiles/tweet.json")) {
    //first time running program, create file.

    fs.writeFile('./jsonFiles/tweet.json', JSON.stringify({ savedTweet: { savedTweet: "" } }), error => {
      if (error) {
        console.error(error);
      }
    })
  } else {
    let rawdata = fs.readFileSync('./jsonFiles/tweet.json');
    savedTweet = JSON.parse(rawdata).savedTweet;
  }
  setInterval(periodicallySaveChannelData, 60000);
}

function jsonReplacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

function saveChannelData() {
  fs.writeFile('./jsonFiles/filterwords.json', JSON.stringify({ filteredwords: filteredwords }), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/tempo.json', JSON.stringify({ tempowords: tempowords }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/permabanned.json', JSON.stringify({ permaban: permaban }), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/Predictions.json', JSON.stringify({ redArray: redArray, blueArray: blueArray }), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/filters.json', JSON.stringify({ banQueue: banQueue }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })


  fs.writeFile('./jsonFiles/Jail.json', JSON.stringify({ timeoutHistory: timeoutHistory }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/count.json', JSON.stringify({ count: count }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/roulette.json', JSON.stringify({ roulette: rouletteCountHistory }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/tweet.json', JSON.stringify({ savedTweet: savedTweet }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })

  fs.writeFile('./jsonFiles/commands.json', JSON.stringify({ commands: commands, quotes: quotes }, jsonReplacer), error => {
    if (error) {
      console.error(error);
    }
  })
}

//
function periodicallySaveChannelData() {
  saveChannelData();
}

function jsonReviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}
setupConfig();