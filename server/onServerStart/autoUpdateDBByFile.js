import { check } from 'meteor/check';

import { tendencyJudge, idolCardsDetail as idolCardsDetailDB, idolCards as idolCardsDB, idolDetail } from '../../db/db.js';


const idolCardsDetailFile = require('../../imports/jsons/idolCardsDetail.json');
const idolCardsFile = require('../../imports/jsons/idolCards.json');

idolCardsFile.forEach(element => {
    const inDB = idolCardsDB.findOne({name: element.name});

    const keyOfFile = Object.keys(element);

    for(let keys of keyOfFile){
        if(element[keys] !== inDB[keys]){
            idolCardsDB.update({_id: inDB._id}, {$set: element});
            break;
        }
    }
});


idolCardsDetailFile.forEach(element => {
    const inDB = idolCardsDetailDB.findOne({cardName: element.cardName});
    
    if(!inDB?.cardName) {
        idolCardsDetailDB.insert(element);
        tendencyJudge.insert({cardName: element.cardName, isJudged: false, lastActive: null, type: element.type, uuidAuth: null});
    }
    else{
        const keyOfFile = Object.keys(element);
        const keyOfDB = Object.keys(inDB);

        for(let keys of keyOfFile){
            if(element[keys] !== inDB[keys]){
                idolCardsDetailDB.update({_id: inDB._id}, {$set: element});
                break;
            }
        }
    }
    /*
    const tj = tendencyJudge.find({cardName: element.cardName});
    if(!tj.length){
        tendencyJudge.insert({cardName: element.cardName, isJudged: false, lastActive: null, type: element.type, uuidAuth: null})
    }
    */
});

