import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import moment from 'moment';

import { init, backupTime } from '../db/db.js';
import { insertInitData } from '../imports/init.js';
import { backup } from './onServerStart/backup.js';

import './imports/methods/methods.js';
import './imports/tendencyJudge.js';
import './onServerStart/autoUpdateDBByFile.js';
import './onServerStart/webMetaTag.js';

import './http/generateSitemap.js';

//import '../fileToDBScript/autoUpdateDBByFile.js';

//backupTime.find({}, {sort: {_id: -1}, limit: 1}).fetch()[0].time
Meteor.startup(() => {
    // code to run on server at startup
    const dbTime = backupTime.find({}, {sort: {_id: -1}, limit: 1}).fetch()[0]?.time;
    const lastBackupTime = dbTime ? dbTime : moment().unix();
    console.log(lastBackupTime);
    //console.log(moment(Number(lastBackupTime)).format('YYYYMMDDHHmmss').unix());
    if(!init.find().fetch().length){
        insertInitData();
    }
    setInterval(backup, 3600000);
});
