import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict'
import { Meteor } from 'meteor/meteor';

import '../router/router.js'

import './main.html';

Template.body.onCreated(function(){
    this.baseData = new ReactiveDict();
    this.baseData.set('units', []);

    Meteor.call('getUnits', [], (err, result) => {
        console.log(JSON.stringify(result));
        this.baseData.set('units', result);
        
    });
    Meteor.call('getIdols', [], (err, result) => {
        console.log(JSON.stringify(result));
        this.baseData.set('idols', result);
    });
});

Template.body.helpers({
    units: function(){
        if(!Template.instance().baseData.get('units')){
            return [];
        }
        else{
            return Template.instance().baseData.get('units');
        }
    },
    idols: function(){
        if(!Template.instance().baseData.get("idols")) return [];
        console.log(this);
        let thisUnit = this.use;
        let thisUnitIdols = Template.instance().baseData.get('idols').filter(element => {
            return element.unit === thisUnit;
        });
        return thisUnitIdols;
    }
});