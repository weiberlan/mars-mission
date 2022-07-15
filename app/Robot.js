import { v4 as uuidv4 } from 'uuid';
import { cardinals } from './utils/cardinals.js';
import { commands } from './utils/commands.js';
import { isRequired } from './utils/isRequired.js';
  
export default class Robot {
    constructor(
        xPosition = isRequired('xPosition'),
        yPosition = isRequired('yPosition'),
        orientation = isRequired('orientation'),
        robotsCenter = isRequired('robotsCenter')
    ) {
        this.validateInputs(xPosition, yPosition, orientation, robotsCenter);
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.orientation = orientation;
        this.robotsCenter = robotsCenter;
        this.lost = false;
        this.lastValidPosition = {};
        this.code = uuidv4();
        this.landingResolver();
    }

    validateInputs(xPosition, yPosition, orientation) {
        if (
            !Number.isInteger(Number(xPosition)) ||
            !Number.isInteger(Number(yPosition)) ||
            Object.keys(cardinals).indexOf(orientation) === -1
        ) {
            throw new Error(`Impossible to place new Robot, please check arrival instructions!`)
        }
    }

    executeCommands(instructions) {
        instructions.split('').forEach((command) => {
            if (this.lost) {
                return;
            }

            if (command === commands.forward) {
                this.move();
                return;
            }

            this.rotate(command);
        });
    }

    move() {
        const newPositions = cardinals[this.orientation]['move'](this.xPosition, this.yPosition);

        if (!this.canMove()) {
            return;
        }

        if (!this.willBeLost(newPositions)) {
            this.xPosition = newPositions.x;
            this.yPosition = newPositions.y;
            return;
        }

        this.lost = true;
        this.lastValidPosition = {
            orientation: this.orientation,
            x: this.xPosition,
            y: this.yPosition
        };
    }

    rotate(rotation) {
        this.orientation = cardinals[this.orientation][rotation];
    }

    willBeLost(newPositions) {
        return (
            newPositions.x > this.robotsCenter.xLimit ||
            newPositions.y > this.robotsCenter.yLimit ||
            newPositions.x < 0 ||
            newPositions.y < 0
        );
    }

    canMove() {
        return !this.robotsCenter.lostRobotsLastPositions.find(
            lostPosition => {
                return (
                    lostPosition.x === this.xPosition &&
                    lostPosition.y === this.yPosition &&
                    lostPosition.orientation === this.orientation
                );
            }
        );
    }

    landingResolver() {
        if (this.xPosition > this.robotsCenter.xLimit || this.yPosition > this.robotsCenter.yLimit) {
            this.lost = true;
        }
    }
}