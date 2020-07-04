import { Meteor } from 'meteor/meteor';
import { idols, units } from '../db/db.js';

Meteor.methods({
    getIdols() {
        //console.log(idols.find({}));
        return idols.find({}).fetch();
    },
    getUnits(){
        return units.find({}).fetch();
    }
});