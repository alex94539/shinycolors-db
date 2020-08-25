import fs from 'fs';

import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, init, produceEvents, tendency, tendencyJudge } from '../../db/db.js';

const path = "C:/Users/KousakaReina/Desktop";

export function backup() {
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

    fs.writeFileSync(path + '/idols.json', JSON.stringify(idolData));
    fs.writeFileSync(path + '/units.json', JSON.stringify(unitsData));
    fs.writeFileSync(path + '/idolDetail.json', JSON.stringify(idolDetailData));
    fs.writeFileSync(path + '/idolCards.json', JSON.stringify(idolCardsData));
    fs.writeFileSync(path + '/idolCardsDetail.json', JSON.stringify(idolCardsDetailData));
    fs.writeFileSync(path + '/bigPic.json', JSON.stringify(bigPicData));
    fs.writeFileSync(path + '/produceEvents.json', JSON.stringify(produceEventsData));
    fs.writeFileSync(path + '/tendency.json', JSON.stringify(tendencyData));
    fs.writeFileSync(path + '/tendencyJudge.json', JSON.stringify(tenJudgeData));
}