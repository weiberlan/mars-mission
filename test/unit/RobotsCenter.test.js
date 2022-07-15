import Robot from "../../app/Robot";
import RobotsCenter from "../../app/RobotsCenter";
import { cardinals } from "../../app/utils/cardinals";

test('create RobotsCenter with valid grid infos', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    expect(robotsCenter).toBeInstanceOf(RobotsCenter);
});

test('throw an Error when creating RobotsCenter without grid infos', () => {
    expect(() => new RobotsCenter()).toThrow(Error);
    expect(() => new RobotsCenter()).toThrow('gridWidth is required!');
    expect(() => new RobotsCenter(5)).toThrow(Error);
    expect(() => new RobotsCenter(5)).toThrow('gridHeight is required!');
});

test('throw an Error when creating RobotsCenter with invalid grid infos', () => {
    expect(() => new RobotsCenter(5, 'three')).toThrow(Error);
    expect(() => new RobotsCenter(5, 'three')).toThrow('Grid sizes must be integers!');
});

test('adding a Robot in grid', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);

    robotsCenter.addRobot(robot);
    expect(robotsCenter.robotList.length).toBe(1);
});

test('sending command to a Robot', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);
    robotsCenter.addRobot(robot);
    robotsCenter.sendCommands(robot, 'LF');
    const updatedRobot = robotsCenter.getLandedRobot(robot.code);

    expect(updatedRobot.lost).toBeFalsy();
    expect(updatedRobot.yPosition).toBe(2);
    expect(updatedRobot.orientation).toBe(cardinals.E.L);
});

test('getting a landed Robot', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);
    robotsCenter.addRobot(robot);
    const landedRobot = robotsCenter.getLandedRobot(robot.code);

    expect(landedRobot).toBeInstanceOf(Robot);
    expect(robot.code).toBe(landedRobot.code);
});

test('updating lost robots position', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(5, 2, 'E', robotsCenter);
    robot.move();
    robotsCenter.updateLostRobotsPositions(robot);

    expect(robotsCenter.lostRobotsLastPositions)
        .toStrictEqual([{orientation: 'E', x: 5, y: 2}]);
});

test('get final robots position', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const aRobot = new Robot(5, 2, 'E', robotsCenter);
    const bRobot = new Robot(4, 1, 'N', robotsCenter);
    const cRobot = new Robot(3, 0, 'S', robotsCenter);

    robotsCenter.addRobot(aRobot);
    robotsCenter.addRobot(bRobot);
    robotsCenter.addRobot(cRobot);

    expect(robotsCenter.getFinalRobotsPositions())
        .toBe(`5 2 E\n4 1 N\n3 0 S`);
});