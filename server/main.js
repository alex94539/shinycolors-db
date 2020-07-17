import { Meteor } from 'meteor/meteor';
import { init } from '../db/db.js';
import { insertInitData } from '../initScript/init.js';

import '../methods/methods.js';

Meteor.startup(() => {
    // code to run on server at startup
    if(!init.find().fetch().length){
        insertInitData();
    }
    
});
