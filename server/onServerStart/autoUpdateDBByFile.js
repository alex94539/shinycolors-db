import { check } from 'meteor/check';

import { idolCardsDetail as idolCardsDetailDB } from '../../db/db.js';


const idolCardsDetailFile = require('../../imports/jsons/idolCardsDetail.json');



idolCardsDetailFile.forEach(element => {
    const inDB = idolCardsDetailDB.findOne({cardName: element.cardName});
    if(!inDB.cardName){
        console.log(element);
    }
    try{
        check(element, inDB);
    }
    catch(error) {
        if(error){
            idolCardsDetailDB.update({_id: inDB._id}, {$set: element});
        }
    }
});

