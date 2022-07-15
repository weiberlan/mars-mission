import { isRequired } from './utils/isRequired.js';

export default class RobotsCenter {
    constructor(
        gridWidth = isRequired('gridWidth'),
        gridHeight = isRequired('gridHeight')
    ) {
        this.validateInputs(gridWidth, gridHeight);
        this.xLimit = gridWidth;
        this.yLimit = gridHeight;
        this.robotList = [];
        this.lostRobotsLastPositions = [];
    }

    validateInputs(gridWidth, gridHeight) {
        if (
            !Number.isInteger(Number(gridWidth)) ||
            !Number.isInteger(Number(gridHeight))
        ) {
            throw new Error(`Grid sizes must be integers!`)
        }
    }
  
    addRobot(robot) {
        this.robotList.push(robot);
    }

    sendCommands(robot, instructions) {
        const robotLanded = this.getLandedRobot(robot.code);

        if (!robotLanded) {
            return;
        }

        robotLanded.executeCommands(instructions);
        this.updateLostRobotsPositions(robotLanded);
    }

    getLandedRobot(code) {
        return this.robotList.find(robotFromList =>
            code === robotFromList.code && !robotFromList.lost
        );
    }

    updateLostRobotsPositions(robotLanded) {
        if (robotLanded.lost) {
            this.lostRobotsLastPositions.push(robotLanded.lastValidPosition);
        }
    }

    getFinalRobotsPositions() {
        const finalPositions = [];
        this.robotList.forEach((robot) => {
            finalPositions.push(`${robot.xPosition} ${robot.yPosition} ${robot.orientation}${robot.lost ? ' LOST' : ''}`);
        });
        return finalPositions.join('\n');
    }
  }