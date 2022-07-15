import Mission from './app/Mission.js';
// TODO: import and use a validator lib
// TODO: refactor processMissionData method

const mission = new Mission('./app/input/data.txt');
mission.runMission().then((data) => console.log(data));