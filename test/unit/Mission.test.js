import { MAX_COORDINATE_VALUE, MAX_INSTRUCTION_LENGTH } from '../../app/utils/constants.js';
import { VALID_MISSION_FILE } from '../helpers/datasetBasePathResolver.js';
import Mission from './../../app/Mission.js';

test('Mission class should instantiate with a valid file', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    expect(mission).toBeInstanceOf(Mission);
    expect(mission.inputFile).toBe(VALID_MISSION_FILE);
});

test('Mission class should not instantiate without a file', () => {
    expect(() => new Mission()).toThrow(Error);
    expect(() => new Mission()).toThrow('inputFile is required!');
});

test('method readMissionFile should read a valid file', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    const expected = `5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL`;

    mission.readMissionFile().then((data) => {
        expect(data).toBe(expected)
    });
});

test('should process valid mission data', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    const missionData = `5 3\n1 1 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL`;
    const expected = `1 1 E\n3 3 N LOST\n2 3 S`;

    expect(mission.processMissionData(missionData)).toBe(expected);
});

test('should process invalid mission data with coordinate above the limit', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    const missionData = `5 3\n1 ${MAX_COORDINATE_VALUE+1} E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\nLLFFFLFLFL`;

    expect(() => mission.processMissionData(missionData))
        .toThrow(Error);
    expect(() => mission.processMissionData(missionData))
        .toThrow(`Robot with coordinate greater than ${MAX_COORDINATE_VALUE}. Please check it!`);
});

test('should process invalid mission data with instruction length above the limit', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    const instruction = 'F';
    const missionData = `5 3\n1 4 E\nRFRFRFRF\n\n3 2 N\nFRRFLLFFRRFLL\n\n0 3 W\n${instruction.repeat(MAX_INSTRUCTION_LENGTH+1)}`;

    expect(() => mission.processMissionData(missionData))
        .toThrow(Error);
    expect(() => mission.processMissionData(missionData))
        .toThrow(`Robot instructions length greater than ${MAX_INSTRUCTION_LENGTH}. Please check it!`);
});