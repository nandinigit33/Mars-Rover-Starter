class Rover {
  // Write code here!
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }
  receiveMessage(message) {
    let messageName = message.name;
    let resultsArr = [];
    for (let i = 0; i < message.commands.length; i++) {
      if (message.commands[i].commandType === "STATUS_CHECK") {
        resultsArr.push({
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position,
          },
        });
      } else if (message.commands[i].commandType === "MODE_CHANGE") {
        resultsArr.push({ completed: true });
        this.mode = message.commands[i].value;
      } else if (message.commands[i].commandType === "MOVE") {
        if (this.mode === "LOW_POWER") {
          resultsArr.push({
            completed: false,
          });
        } else {
          resultsArr.push({
            completed: true,
          });
          this.position = message.commands[i].value;
        }
      } else {
        resultsArr.push(message.commands[i]);
      }
    }

    let messageObject = {
      message: messageName,
      results: resultsArr,
    };

    return messageObject;
  }
}

module.exports = Rover;
