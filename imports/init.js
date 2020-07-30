import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, init } from '../db/db.js';


const initbigPic = require('./jsons/bigPic.json');
const initidolCards = require('./jsons/idolCards.json');
const initidolCardsDetail = require('./jsons/idolCardsDetail.json');
const initidolDetail = require('./jsons/idolDetail.json');
const initidols = require('./jsons/idols.json');
const initunits = require('./jsons/units.json');

export function insertInitData(){
    init.insert({initialized: true});
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
}