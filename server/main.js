import { Meteor } from 'meteor/meteor';

import { init } from '../db/db.js';
import { insertInitData } from '../fileToDBScript/init.js';

import '../methods/methods.js';
import './tendencyJudge/tendencyJudge.js';
import './autoUpdateDBByFile/autoUpdateDBByFile.js';
import './http/generateSitemap.js';
//import '../fileToDBScript/autoUpdateDBByFile.js';

Meteor.startup(() => {
    // code to run on server at startup
    if(!init.find().fetch().length){
        insertInitData();
    }
    console.log(Meteor.release);
    /*
    SSLProxy({
        port: 5555,
        ssl: {
            key: Assets.getText('privkey.pem'),
            cert: Assets.getText('cert.pem')
        }
    })
    */
});
