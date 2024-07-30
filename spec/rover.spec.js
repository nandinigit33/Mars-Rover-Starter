const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  // 7 tests here!

  it("constructor sets position and default values for mode and generatorWatts", function () {
    let rover = new Rover(98382);
    expect(rover.position).toBe(98382);
    expect(rover.mode).toBe("NORMAL");
    expect(rover.generatorWatts).toBe(110);
  });

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

  it("responds correctly to the mode change command", function () {
    let command = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message("Changing mode to low power", command);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{ completed: true }]);
    expect(rover.mode).toEqual("LOW_POWER");
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("MOVE", 10000),
    ];
    let message = new Message("Error: Low power mode, cannot move", commands);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(response.results[1]).toEqual({ completed: false });
    expect(rover.position).toEqual(98382);
  });

  it("responds with the position for the move command", function () {
    let commands = [new Command("MOVE", 10000)];
    let message = new Message("Moving to postion 10000", commands);
    let rover = new Rover(98382); // Passes 98382 as the rover's position.
    let response = rover.receiveMessage(message);
    expect(rover.position).toEqual(10000);
  });
});
