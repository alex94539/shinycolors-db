import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, init, produceEvents, tendency, tendencyJudge, backupTime } from '../db/db.js';

import moment from 'moment';

const initbigPic = require('./jsons/bigPic.json');
const initidolCards = require('./jsons/idolCards.json');
const initidolCardsDetail = require('./jsons/idolCardsDetail.json');
const initidolDetail = require('./jsons/idolDetail.json');
const initidols = require('./jsons/idols.json');
const initunits = require('./jsons/units.json');
const initproduceEvents = require('./jsons/produceEvents.json');
const inittendency = require('./jsons/tendency.json');
const inittendencyJudge = require('./jsons/tendencyJudge.json');

export function insertInitData(){
    initbigPic.forEach(element => {
        bigPic.insert(element);
    });
    initidolCards.forEach(element => {
        idolCards.insert(element);
    });
    initidolCardsDetail.forEach(element => {
        idolCardsDetail.insert(element);
    });
    initidolDetail.forEach(element => {
        idolDetail.insert(element);
    });
    initidols.forEach(element => {
        idols.insert(element);
    });
    initunits.forEach(element => {
        units.insert(element)
    });
    initproduceEvents.forEach(element => {
        produceEvents.insert(element);
    });
    inittendency.forEach(element =>{
        tendency.insert(element);
    });
    inittendencyJudge.forEach(element => {
        tendencyJudge.insert(element);
    });
    init.insert({initialized: true});
    backupTime.insert({type: 'autoBackup', time: moment().format('YYYYMMDDhhmmss')})
}