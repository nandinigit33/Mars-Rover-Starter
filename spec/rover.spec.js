const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

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
describe("Rover class", function () {
  // 7 tests here!

  //Test 7 Constructor Sets Default Values: Checks if the Rover constructor sets initial values correctly.
  it("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(98382);
    expect(rover.position).toBe(98382);
    expect(rover.mode).toBe("NORMAL");
    expect(rover.generatorWatts).toBe(110);
  });

  //Test 8 Response Contains Message Name: Verifies if the response message matches the expected value.
  it("response returned by receiveMessage contains the name of the message", function () {
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    let message = new Message("Test message with two commands", commands);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual("Test message with two commands");
  });

  //Test 9 Response of receiveMessage(message) Contains Two Results: Checks if the response includes two results for two commands.
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    let message = new Message("Test message with two commands", commands);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(commands.length);
  });

  //Test 10 ensures that the Rover responds correctly to a status check command.
  it("responds correctly to the status check command", function () {
    let command = [new Command("STATUS_CHECK")];
    let message = new Message("Status Check Command Message", command);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    let expectedResults = {
      mode: rover.mode,
      generatorWatts: rover.generatorWatts,
      position: rover.position,
    };
    expect(response.results[0].roverStatus).toEqual(expectedResults);
  });

  //Test 11 Verifies if the Rover responds correctly to a mode change command.
  it("responds correctly to the mode change command", function () {
    let command = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("Changing mode to low power", command);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{ completed: true }]);
    // expect(response.results[0].completed).toBe(true);
    expect(rover.mode).toStrictEqual("LOW_POWER");
  });

  //Test 12 Checks if the Rover returns false when attempting to move in low-power mode.
  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 100000),
    ];
    let message = new Message("Error: Low power mode, cannot move", commands);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.results[1]).toEqual({ completed: false });
    expect(rover.position).toEqual(98382);
  });

  //Test 13 Verifies if the Rover responds with the correct position after a move command.
  it("responds with the position for the move command", function () {
    let command = [new Command("MOVE", 100000)];
    let message = new Message("Moving to postion 100000", command);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(rover.position).toEqual(100000);
    expect(response.results[0].completed).toBe(true);
  });
});
