import { Meteor } from 'meteor/meteor';
import { tendency } from '../../db/db.js';
import { tendencyJudge } from '../../db/db.js';
import moment from 'moment';




setInterval(async function() {
    //console.log();
    
    tendencyJudge.find({lastActive: {$ne: null}}).fetch().forEach(element => {
        if(moment().valueOf() - moment(element.lastActive).valueOf() >= 1800000 && !element.isJudged){
            tendencyJudge.update({_id: element._id}, {$set: {lastActive: null, uuidAuth: null}});
        }
    });
    
}, 1800000);

