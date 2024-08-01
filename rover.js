class Rover {
  // Write code here!
  constructor(position) {
    this.position = position;
    this.mode = "NORMAL";
    this.generatorWatts = 110;
  }

  receiveMessage(message) {
    //Returns an object containing at least two properties:
    let resultsArray = [];
    for (let command of message.commands) {
      let result = this.executeCommand(command);
      resultsArray.push(result);
    }
    return {
      message: message.name, // Use message.name to set the message name in the response
      results: resultsArray,
    };
  }

  executeCommand(command) {
    if (command.commandType === "STATUS_CHECK") {
      return {
        completed: true,
        roverStatus: {
          mode: this.mode,
          generatorWatts: this.generatorWatts,
          position: this.position,
        },
      };
    } else if (command.commandType === "MODE_CHANGE") {
      this.mode = command.value;
      return { completed: true };
    } else if (command.commandType === "MOVE") {
      if (this.mode === "LOW_POWER") {
        return { completed: false };
      } else {
        this.position = command.value;
        return { completed: true };
      }
    }
  }
}
module.exports = Rover;

/*   
    1)constructor(position)
        position is a number representing the rover’s position.
        Sets this.position to position
        Sets this.mode to 'NORMAL'
        Sets the default value for generatorWatts to 110

    2) receiveMessage(message)
        message is a Message object
        Returns an object containing at least two properties:
            message: the name of the original Message object
            results: an array of results. Each element in the array is an object that corresponds to one Command in message.commands.
        Updates certain properties of the rover object
            Details about how to respond to different commands are in the Command Types table .           

*/
