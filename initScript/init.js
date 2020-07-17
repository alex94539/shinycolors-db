import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, init } from '../db/db.js';


const initbigPic = require('./bigPic.json');
const initidolCards = require('./idolCards.json');
const initidolCardsDetail = require('./idolCardsDetail.json');
const initidolDetail = require('./idolDetail.json');
const initidols = require('./idols.json');
const initunits = require('./units.json');

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