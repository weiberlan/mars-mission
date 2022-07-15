import Mission from './app/Mission.js';

const mission = new Mission('./app/input/data.txt');
mission.runMission().then((data) => console.log(data));