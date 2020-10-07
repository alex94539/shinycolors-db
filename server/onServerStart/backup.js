import fs from 'fs';
import moment from 'moment';

import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, init, produceEvents, tendency, tendencyJudge, backupTime } from '../../db/db.js';

const path = "/var/SCDB/";

export async function backup() {
    const lastBackupObj = backupTime.find({}, {sort: {_id: -1}, limit: 1}).fetch();
    const lastBackupUnix = !lastBackupObj.length ? 0 : lastBackupObj[0].time;
    const currentTime = moment().format('YYYYMMDDHHmmss'), 
          currentUnix = moment().unix();
          //lastBackupUnix = moment(Number(lastBackupTime)).format('YYYYMMDDHHmmss').unix();
    console.log(lastBackupUnix, currentUnix);

    //return;
    //console.log(`%c ${moment().unix()} - ${moment(Number(lastBackupTime)).format('YYYYMMDDHHmmss')}`, 'background: orange; color: green');
    if(Number(currentUnix) - Number(lastBackupUnix) < 43200){
        return;
    }
    console.log('%c start backup DB at ' + currentTime, 'background: orange; color: green');
    let idolData = idols.find().fetch();
    let unitsData = units.find().fetch();
    let idolDetailData = idolDetail.find().fetch();
    let idolCardsData = idolCards.find().fetch();
    let idolCardsDetailData = idolCardsDetail.find().fetch();
    let bigPicData = bigPic.find().fetch();
    let produceEventsData = produceEvents.find().fetch();
    let tendencyData = tendency.find().fetch();
    let tenJudgeData = tendencyJudge.find().fetch();

    idolData.forEach(element => {
        delete element._id;
    });
    unitsData.forEach(element => {
        delete element._id;
    });
    idolDetailData.forEach(element => {
        delete element._id;
    });
    idolCardsData.forEach(element => {
        delete element._id;
    });
    idolCardsDetailData.forEach(element => {
        delete element._id;
    });
    bigPicData.forEach(element => {
        delete element._id;
    });
    produceEventsData.forEach(element => {
        delete element._id;
    });
    tendencyData.forEach(element => {
        delete element._id;
    });
    tenJudgeData.forEach(element => {
        delete element._id;
    });

    const thisBackupDir = path + currentTime; 

    fs.mkdir(thisBackupDir, async function(){
        fs.writeFileSync(thisBackupDir + '/idols.json', JSON.stringify(idolData));
        fs.writeFileSync(thisBackupDir + '/units.json', JSON.stringify(unitsData));
        fs.writeFileSync(thisBackupDir + '/idolDetail.json', JSON.stringify(idolDetailData));
        fs.writeFileSync(thisBackupDir + '/idolCards.json', JSON.stringify(idolCardsData));
        fs.writeFileSync(thisBackupDir + '/idolCardsDetail.json', JSON.stringify(idolCardsDetailData));
        fs.writeFileSync(thisBackupDir + '/bigPic.json', JSON.stringify(bigPicData));
        fs.writeFileSync(thisBackupDir + '/produceEvents.json', JSON.stringify(produceEventsData));
        fs.writeFileSync(thisBackupDir + '/tendency.json', JSON.stringify(tendencyData));
        fs.writeFileSync(thisBackupDir + '/tendencyJudge.json', JSON.stringify(tenJudgeData));

        backupTime.insert({type: 'autoBackup', time: currentUnix});
    });

    
}