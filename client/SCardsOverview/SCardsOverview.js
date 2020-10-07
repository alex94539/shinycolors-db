import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './SCardsOverview.html';

Template.SCardsOverview.onCreated(function(){
    this.currentFilterResult = new ReactiveVar([]);
	this.baseData = new ReactiveDict();
    this.checkStatus = new ReactiveDict();
    this.resultIsNull = new ReactiveVar(false);
    /*
    Meteor.call('produceCardFilterQuery', {queryObj: {}}, (err, result) => {
        this.currentFilterResult.set(result);
    });
    */
    if(!localStorage.getItem('units')){
		Meteor.call('getUnits', [], (err, result) => {
			this.baseData.set('units', result);
			localStorage.setItem('units', JSON.stringify(result));
		});
	}
	else{
		let localUnits = JSON.parse(localStorage.getItem('units'));
		this.baseData.set('units', localUnits);
	}
	
	if(!localStorage.getItem('idols')){
		Meteor.call('getIdols', [], (err, result) => {
			this.baseData.set('idols', result);
			localStorage.setItem('idols', JSON.stringify(result));
		});
	}
	else{
		let localIdols = JSON.parse(localStorage.getItem('idols'));
		this.baseData.set('idols', localIdols);
	}
});

Template.SCardsOverview.helpers({
    thisFilterResult: function(){
        return Template.instance().currentFilterResult.get();
    },
    thisResultType: function(){
        if(this.typeProduce){
            return 'PCardDetail';
        }
        else if(this.typeSupport){
            return 'SCardDetail';
        }
        return;
    },
    thisResultLink: function(){
        return Base64.encodeURI(this.cardName);
    },
    units: function(){
        return Template.instance().baseData.get('units');
    },
    idols: function(){
        return Template.instance().baseData.get('idols').filter(idol => this.use === idol.unit);
    }
});

Template.SCardsOverview.events({
    'submit #thisFilterForm'(event, instance){
        event.preventDefault();

        let formObj = {};
        let queryIdolsArr = new Array();

        instance.findAll('input:checkbox').forEach(element => {
            if(element.checked){
                formObj[element.id] = element.checked;
            }
        });

        instance.baseData.get('units').forEach(element => {
            delete formObj[element.jap];
        });
        instance.baseData.get('idols').forEach(element => {
            if(element.name in formObj){
                delete formObj[element.name];
                queryIdolsArr.push({idol: element.name});
            }
        });
        console.log(formObj, queryIdolsArr);

        if(!queryIdolsArr.length){
            instance.baseData.get('idols').forEach(element => {
                queryIdolsArr.push({idol: element.name});
            });
        }
        Meteor.call('produceCardFilterQuery', {queryObj: formObj, idols: queryIdolsArr}, (err, result) => {
            if(!result.length){
                alert('查無結果');
                return;
            }
            
            instance.currentFilterResult.set(result);

            instance.find('#thisFilterForm').style.display = 'none';
            instance.find('#thisFilterCards').style.display = 'block';
        });
    },
    'click .unitClass'(event, instance){
        let toCheck = instance.baseData.get('idols').filter(idol => this.use === idol.unit);
        //console.log(toCheck);
        if(!instance.checkStatus.get(this.use)){
            toCheck.forEach(element => {
                instance.find(`#${element.name}`).checked = true;
            });
            instance.checkStatus.set(this.use, true);
        }
        else{
            toCheck.forEach(element => {
                instance.find(`#${element.name}`).checked = false;
            });
            instance.checkStatus.set(this.use, false);
        }
        
    },
    'click #resetForm'(event, instance){
        instance.findAll('input:checkbox').forEach(element => {
            element.checked = false;
        });
    },
    'click #newQuery'(event, instance){
        instance.currentFilterResult.set([]);
        instance.findAll('input:checkbox').forEach(element => {
            element.checked = false;
        });

        instance.find('#thisFilterForm').style.display = 'block';
        instance.find('#thisFilterCards').style.display = 'none';
    }
});