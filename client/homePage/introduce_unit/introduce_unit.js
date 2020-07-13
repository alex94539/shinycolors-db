import { FlowRouter } from "meteor/kadira:flow-router";
import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from "meteor/reactive-dict";
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from "meteor/tracker";


import './introduce_unit.html';

Template.introduce_unit.onCreated(function() {
    this.currentUnits = new ReactiveVar('');
    this.currentIdols = new ReactiveVar([]);
    this.currentIdolPic = new ReactiveVar(0);
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();
        if(FlowRouter.getRouteName() !== 'unit') Blaze.remove(this.view);
        this.currentUnits.set(FlowRouter.current().params.unitName);
        this.currentIdolPic.set(0);
    });

    this.baseData = new ReactiveDict();
    Meteor.call("getIdols", [], (err, result) => {
        this.baseData.set("idols", result);
    });
    Meteor.call("getUnits", [], (err, result) => {
        this.baseData.set("units", result);
    });

});

Template.introduce_unit.helpers({
    thisUnit(){
        return Template.instance().currentUnits.get();
    },
    thisUnitIdols(){
        if(!Template.instance().baseData.get("idols")) return '';

        return Template.instance().baseData.get("idols").filter(element => {
            //console.log(element);
            return Template.instance().currentUnits.get() === element.unit;
        });
    },
    thisUnitIdolsCount(){
        if(!Template.instance().baseData.get("idols")) return '';

        return Template.instance().baseData.get("idols").filter(element => {
            return Template.instance().currentUnits.get() === element.unit;
        }).length
    },
    thisUnitJap(){
        if(!Template.instance().baseData.get('units')) return '';
        
        return Template.instance().baseData.get('units').filter(element => {
            return Template.instance().currentUnits.get() === element.use;
        })[0].jap;
    },
    thisUnitPV(){
        if(!Template.instance().baseData.get('units')) return '';

        return Template.instance().baseData.get('units').filter(element => {
            return Template.instance().currentUnits.get() === element.use;
        })[0].unitPV.replace(/watch\?v=/, 'embed/'); 
    },
    thisIdolPic(){
        if(!Template.instance().baseData.get("units")) return '';
        let thisIdol = Template.instance().baseData.get("idols").filter(element => {
            //console.log(element);
            return Template.instance().currentUnits.get() === element.unit;
        })[Template.instance().currentIdolPic.get()].nick;
        return `/${Template.instance().currentUnits.get()}/icon/${thisIdol}.jpg`;
    },
    thisIdol(){
        if(!Template.instance().baseData.get("idols")) return '';

        let thisIdol = Template.instance().baseData.get("idols").filter(element => {
            //console.log(element);
            return Template.instance().currentUnits.get() === element.unit;
        })[Template.instance().currentIdolPic.get()].name;
        return thisIdol;
    }
});

Template.introduce_unit.events({
    'click #thisUnitIdolPic'(event, instance){
        event.preventDefault();
        let nextIndex = instance.currentIdolPic.get() + 1 < instance.baseData.get("idols").filter(element => {
            return instance.currentUnits.get() === element.unit;
        }).length ? instance.currentIdolPic.get() + 1 : 0;
        instance.currentIdolPic.set(nextIndex);
    }
});

Template.introduce_unit.onDestroyed(function() {    
    console.log('unit Kaboom!');
})