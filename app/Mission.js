import RobotsCenter from './RobotsCenter.js';
import Robot from './Robot.js';
import fs from 'fs';
import util from 'util';
import { isRequired } from './utils/isRequired.js';
import { MAX_COORDINATE_VALUE, MAX_INSTRUCTION_LENGTH } from './utils/constants.js';

export default class Mission {
    constructor(inputFile = isRequired('inputFile')) {
        this.inputFile = inputFile;
    }

    runMission() {
        return this.readMissionFile().then(this.processMissionData);
    }

    readMissionFile() {
        const readFile = util.promisify(fs.readFile);
        return readFile(this.inputFile, 'utf8');
    }

    processMissionData(data) {
        const lines = data.trim().split(/[\r\n]+/).filter(n => n);
        const gridDimensions = lines.shift().split(' ');

        const robotsCenter = new RobotsCenter(gridDimensions[0], gridDimensions[1]);

        while(lines.length > 0) {
            const robotPositionInfo = lines.shift().split(' ');
            const instructions = lines.shift();

            if (robotPositionInfo[0] > MAX_COORDINATE_VALUE || robotPositionInfo[1] > MAX_COORDINATE_VALUE) {
                throw new Error(`Robot with coordinate greater than ${MAX_COORDINATE_VALUE}. Please check it!`)
            }

            if (instructions.length > MAX_INSTRUCTION_LENGTH) {
                throw new Error(`Robot instructions length greater than ${MAX_INSTRUCTION_LENGTH}. Please check it!`)
            }

            const currentRobot = new Robot(
                Number(robotPositionInfo[0]),
                Number(robotPositionInfo[1]),
                robotPositionInfo[2],
                robotsCenter
            );
            
            robotsCenter.addRobot(currentRobot);


            robotsCenter.sendCommands(currentRobot, instructions);
        }

        return robotsCenter.getFinalRobotsPositions();
    }
}