import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './SCardsOverview.html';

const supportSkill = require('../../imports/jsons/supportSkill.json');
const tendency = ['VoTendency', 'DaTendency', 'ViTendency', 'MeTendency'];
const rarityArr = ['raritySSR', 'raritySR', 'rarityR', 'rarityN'];
const ideaArr = ['noteVocal', 'noteDance', 'noteVisual', 'noteTalk', 'noteAppeal'];
const hiramekiArr = ['hiramekiVo', 'hiramekiDa', 'hiramekiVi', 'hiramekiMe'];

Template.SCardsOverview.onCreated(function(){
    this.currentFilterResult = new ReactiveVar([]);
	this.baseData = new ReactiveDict();
    this.checkStatus = new ReactiveDict();
    this.resultIsNull = new ReactiveVar(false);
    this.supportSkill = new ReactiveVar(supportSkill);
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
    },
    supportSkills: function() {
        return Template.instance().supportSkill.get()?.mainSkill ?? [];
    },
    subOptions: function(){
        return Template.instance().supportSkill.get()?.subOption ?? [];
    },
    loop: function(){
        return [{},{},{},{}]
    }
});

Template.SCardsOverview.events({
    'submit #thisFilterForm'(event, instance){
        event.preventDefault();

        let formObj = {};
        let queryIdolArr = new Array(),
            queryRarityArr = new Array(),
            queryIdeaArr = new Array(),
            queryHiramekiArr = new Array(),
            queryTendencyArr = new Array();

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
                queryIdolArr.push({idol: element.name});
            }
        });

        generateOrArr(tendency, formObj, queryTendencyArr);

        generateOrArr(rarityArr, formObj, queryRarityArr);

        generateOrArr(ideaArr, formObj, queryIdeaArr);

        generateOrArr(hiramekiArr, formObj, queryHiramekiArr);


        for(let k = 0; k < 4; k++){
            let thisSkill = instance.find(`#mainSkill${k}`).value;
            let subOption = instance.find(`#subOption${k}`).value;

            if(!thisSkill){
                continue;
            }

            formObj[`support${thisSkill + subOption}`] = true;
        }

        if(!queryIdolArr.length){
            instance.baseData.get('idols').forEach(element => {
                queryIdolArr.push({idol: element.name});
            });
        }

        if(!queryTendencyArr.length) {
            tendency.forEach(element => {
                let temp = new Object();
                temp[element] = true;

                queryTendencyArr.push(temp);
            })
        }

        if(!queryRarityArr.length){
            rarityArr.forEach(element => {
                let temp = new Object();
                temp[element] = true;

                queryRarityArr.push(temp);
            });
        }

        if(!queryIdeaArr.length){
            ideaArr.forEach(element => {
                let temp = new Object();
                temp[element] = true;

                queryIdeaArr.push(temp);
            });
        }

        if(!queryHiramekiArr.length){
            hiramekiArr.forEach(element => {
                let temp = new Object();
                temp[element] = true;

                queryHiramekiArr.push(temp);
            });
        }

        console.log(formObj, queryIdolArr, queryRarityArr, queryIdeaArr, queryHiramekiArr, queryTendencyArr);


        Meteor.call('supportCardFilterQuery', {queryObj: formObj, queryIdols: queryIdolArr, queryRarity: queryRarityArr, queryIdea: queryIdeaArr, queryHirameki: queryHiramekiArr, queryTendency: queryTendencyArr}, (err, result) => {
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

        for(let k = 0; k < 4; k++){
            let thisSkill = instance.find(`#mainSkill${k}`);
            let subOption = instance.find(`#subOption${k}`);

            thisSkill.selectedIndex = 0;
            subOption.selectedIndex = 0;
            subOption.disabled = true;
        }
    },
    'click #newQuery'(event, instance){
        instance.currentFilterResult.set([]);
        instance.findAll('input:checkbox').forEach(element => {
            element.checked = false;
        });

        instance.find('#thisFilterForm').style.display = 'block';
        instance.find('#thisFilterCards').style.display = 'none';
    },
    'change .mainSkill'(event, instance){
        event.preventDefault();
        //console.log(event)
        toggleDisabled(instance, event.target.value, event.currentTarget.id)
    }
});

function toggleDisabled(instance, option, elementID){
    supportSkill.mainSkill.forEach(element => {
        if(option.match(element.skillName)){
            let toChange = elementID.replace(/mainSkill/, 'subOption');
            //console.log(toChange, element)
            if(element.type == 'noOption'){
                instance.find(`#${toChange}`).disabled = true;
                instance.find(`#${toChange}`).selectedIndex = 0;
            }
            else{
                instance.find(`#${toChange}`).disabled = false;
            }
        }
    })
}

function generateOrArr(arr, formObj, orArr){
    arr.forEach(element => {
        if(element in formObj){
            delete formObj[element];
            let temp = new Object();
            temp[element] = true;

            orArr.push(temp);
        }
    })
}