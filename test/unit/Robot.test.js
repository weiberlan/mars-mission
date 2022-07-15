import Robot from "../../app/Robot";
import RobotsCenter from "../../app/RobotsCenter";
import { cardinals } from "../../app/utils/cardinals";
import { commands } from "../../app/utils/commands";

test('Robot class should not instantiate without required data', () => {
    expect(() => new Robot()).toThrow(Error);
    expect(() => new Robot(1)).toThrow(Error);
    expect(() => new Robot(1, 1)).toThrow(Error);
    expect(() => new Robot(1, 1, 'E')).toThrow(Error);
});

test('Robot class instantiation should indicate required data', () => {
    expect(() => new Robot()).toThrow('xPosition is required!');
    expect(() => new Robot(1)).toThrow('yPosition is required!');
    expect(() => new Robot(1, 1)).toThrow('orientation is required!');
    expect(() => new Robot(1, 1, 'E')).toThrow('robotsCenter is required!');
});

test('should throw an Error when trying to create a robot with invalid inputs', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    expect(() => new Robot(1, 1, 'Z', robotsCenter))
        .toThrow(Error);
    expect(() => new Robot(1, 1, 'Z', robotsCenter))
        .toThrow('Impossible to place new Robot, please check arrival instructions!');
});

test('should create Robot to be landed on valid position (not lost Robot)', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);

    expect(robot.lost).toBeFalsy();
});

test('should create Robot to be landed on invalid position (lost Robot)', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 4, 'E', robotsCenter);

    expect(robot.lost).toBeTruthy();
});

test('Robot should turn 90 degrees left', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);

    robot.rotate(commands.left);
    expect(robot.orientation).toBe(cardinals.E.L);
});

test('Robot should turn 90 degrees right', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);

    robot.rotate(commands.right);
    expect(robot.orientation).toBe(cardinals.E.R);
});

test('Robot should turn correct in all directions', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robot = new Robot(1, 1, 'E', robotsCenter);

    robot.rotate(commands.left);
    expect(robot.orientation).toBe(cardinals.E.L);

    robot.rotate(commands.left);
    expect(robot.orientation).toBe(cardinals.N.L);

    robot.rotate(commands.left);
    expect(robot.orientation).toBe(cardinals.W.L);

    robot.rotate(commands.left);
    expect(robot.orientation).toBe(cardinals.S.L);

    robot.rotate(commands.right);
    expect(robot.orientation).toBe(cardinals.E.R);

    robot.rotate(commands.right);
    expect(robot.orientation).toBe(cardinals.S.R);

    robot.rotate(commands.right);
    expect(robot.orientation).toBe(cardinals.W.R);

    robot.rotate(commands.right);
    expect(robot.orientation).toBe(cardinals.N.R);
});

test('Robot should move in X coordinate and not be lost', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robotFacingEast = new Robot(1, 1, 'E', robotsCenter);

    robotFacingEast.move();
    expect(robotFacingEast.xPosition).toBe(2);

    const robotFacingWest = new Robot(1, 1, 'W', robotsCenter);

    robotFacingWest.move();
    expect(robotFacingWest.xPosition).toBe(0);
});

test('Robot should move in Y coordinate and not be lost', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robotFacingNorth = new Robot(1, 1, 'N', robotsCenter);

    robotFacingNorth.move();
    expect(robotFacingNorth.yPosition).toBe(2);

    const robotFacingSouth = new Robot(1, 1, 'S', robotsCenter);

    robotFacingSouth.move();
    expect(robotFacingSouth.yPosition).toBe(0);
});

test('Robot should move in X coordinate and be lost out of the grid', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robotFacingEast = new Robot(5, 2, 'E', robotsCenter);

    expect(robotFacingEast.lost).toBeFalsy();
    robotFacingEast.move();
    expect(robotFacingEast.lost).toBeTruthy();

    const robotFacingWest = new Robot(0, 2, 'W', robotsCenter);

    expect(robotFacingWest.lost).toBeFalsy();
    robotFacingWest.move();
    expect(robotFacingWest.lost).toBeTruthy();
});

test('Robot should move in Y coordinate and be lost out of the grid', () => {
    const robotsCenter = new RobotsCenter(5, 3);
    const robotFacingNorth = new Robot(2, 3, 'N', robotsCenter);

    expect(robotFacingNorth.lost).toBeFalsy();
    robotFacingNorth.move();
    expect(robotFacingNorth.lost).toBeTruthy();

    const robotFacingSouth = new Robot(2, 0, 'S', robotsCenter);

    expect(robotFacingSouth.lost).toBeFalsy();
    robotFacingSouth.move();
    expect(robotFacingSouth.lost).toBeTruthy();
});

test('Robot should not move in prohibit position that lost a Robot before', () => {
    const robotsCenter = new RobotsCenter(5, 3);

    const robot = new Robot(3, 3, 'N', robotsCenter);
    robot.move();
    expect(robot.lost).toBeTruthy();

    robotsCenter.lostRobotsLastPositions = [{ orientation: 'N', x: 3, y: 3 }];

    const newRobot = new Robot(3, 3, 'N', robotsCenter);
    newRobot.move();
    expect(newRobot.lost).toBeFalsy();
});