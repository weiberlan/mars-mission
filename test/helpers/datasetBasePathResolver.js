import { getProjectPath } from './basePathResolver.js';

export const VALID_MISSION_FILE = `${getProjectPath()}/test/datasets/valid.txt`;
export const INVALID_MISSION_FILE_COORDINATE_ABOVE_THE_LIMIT = `${getProjectPath()}/test/datasets/valid-above-max-coordinate.txt`;
export const INVALID_MISSION_FILE_INSTRUCTION_ABOVE_THE_LIMIT = `${getProjectPath()}/test/datasets/valid-above-max-instruction.txt`;