import { Meteor } from 'meteor/meteor';
import fs from 'fs';

import { init, tendency, tendencyJudge } from '../db/db.js';
import { insertInitData } from '../imports/init.js';
import { backup } from './onServerStart/backup.js';

import './imports/methods/methods.js';
import './imports/tendencyJudge.js';
import './onServerStart/autoUpdateDBByFile.js';
import './onServerStart/webMetaTag.js';

import './http/generateSitemap.js';

//import '../fileToDBScript/autoUpdateDBByFile.js';


Meteor.startup(() => {
    // code to run on server at startup
    if(!init.find().fetch().length){
        insertInitData();
    }
    //backup();
});
