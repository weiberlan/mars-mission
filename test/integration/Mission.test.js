import { VALID_MISSION_FILE } from '../helpers/datasetBasePathResolver.js';
import Mission from './../../app/Mission.js';

test('should run complete mission', () => {
    const mission = new Mission(VALID_MISSION_FILE);
    const expected = `1 1 E\n3 3 N LOST\n2 3 S`;
    mission.runMission().then(
        (data) => expect(data).toBe(expected)
    );
});