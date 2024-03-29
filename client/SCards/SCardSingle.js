import { Meteor } from "meteor/meteor";
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './SCardSingle.html';

Template.SCardSingle.onCreated(function() {
    Tracker.autorun(() => {
		this.currentSCard = new ReactiveVar();
		this.currentSCardDetail = new ReactiveVar();
		this.currentSCardPic = new ReactiveVar();
		FlowRouter.watchPathChange();
		if (FlowRouter.getRouteName() !== 'SCardDetail') {
			Blaze.remove(this.view);
			return;
		}
		const card = Base64.decode(FlowRouter.current().params.cardName);
		this.currentSCard.set(card);

		Meteor.call('getSCardSingleDetail', {cardName: this.currentSCard.get()}, (err, result) => {
			if (!result.length) {
				FlowRouter.go('noSuchCards');
			}
			this.currentSCardDetail.set(result[0]);
			console.log(result);
		});

		Meteor.call('getThisCardImage', {cardName: this.currentSCard.get().replace(/【/, '').replace(/】/, ' ')}, (err, result) => {
			//console.log(result);
			this.currentSCardPic.set(result[0]);
		});
	});
});

Template.SCardSingle.helpers({
	thisCardIdolEvents: function () {
		return Template.instance().currentSCardDetail.get()?.events ?? [];
	},
	thisCardName: function () {
		return Template.instance().currentSCardDetail.get()?.cardName ?? '';
	},
	thisCardImage: function(){
		return Template.instance().currentSCardPic.get()?.uuid ?? ''
	},
	thisCardSkill20: function () {
		return Template.instance().currentSCardDetail.get()?.panel[20] ?? '';
	},
	thisCardSkill30: function () {
		return Template.instance().currentSCardDetail.get()?.panel[30] ?? '';
	},
	thisCardSkill40: function () {
		return Template.instance().currentSCardDetail.get()?.panel[40] ?? '';
	},
	thisCardSkill50: function () {
		return Template.instance().currentSCardDetail.get()?.panel[50] ?? '';
	},
	has40SPSkill: function () {
		if (!Template.instance().currentSCardDetail.get() || Template.instance().currentSCardDetail.get().type === 'S_N') {
			return false;
		} else {
			return true;
		}
	},
	has50SPSkill: function () {
		if (!Template.instance().currentSCardDetail.get() || Template.instance().currentSCardDetail.get().type === 'S_N' || Template.instance().currentSCardDetail.get().type === 'S_R') {
			return false;
		} else {
			return true;
		}
	},
	cellColor: function () {
		//console.log(this);
		if (this.skillTitle.match(/Vocal.*Dance/)) return 'classVoDa';
		if (this.skillTitle.match(/Vocal.*Visual/)) return 'classVoVi';
		if (this.skillTitle.match(/Dance.*Visual/)) return 'classDaVi';
		if (this.skillTitle.match(/Vocal/)) return 'classVo';
		if (this.skillTitle.match(/Dance/)) return 'classDa';
		if (this.skillTitle.match(/Visual/)) return 'classVi';
		if (this.skillTitle.match(/メンタル\d+%回復/)) return 'classVi';
		if (this.skillTitle.match(/メンタル/)) return 'classMe';
	},
	SRColSpan: function () {
		if (
			!Template.instance().currentSCardDetail.get() ||
			Template.instance().currentSCardDetail.get().type === 'S_N' ||
			Template.instance().currentSCardDetail.get().type === 'S_R' ||
			Template.instance().currentSCardDetail.get().type === 'S_SSR'
		) {
			return false;
		} else {
			return true;
		}
	},
	sliceSkillDesc: function () {
        if (!Template.instance().currentSCardDetail.get()) return [];
        let tempStr = this.skillDesc;
        tempStr = strReplacement(tempStr);
        //console.log(tempStr);
		if (this.skillTitle.match(/(Visual\d+%UP)|(Vocal\d+%UP)|(Dance\d+%UP)|(メンタルダメージ\d+%CUT)|(メンタル\d+%回復)|(Vo.*\d+%UP)|(Da.*\d+%UP)|(Vi.*\d+%UP)|(注目度\d+%DOWN)|(思い出ゲージ\d+%UP)/)) {
			return tempStr.match(/\[.*?\]/g);
		} 
		else if (this.skillTitle.match(/(メンタル上限UP)|(Vocal上限UP)|(Visual上限UP)|(Dance上限UP)|(アピール)/)) {
			return [tempStr];
		} 
		//else if (tempStr.match(/(アピール)/)) {
		//	return [tempStr];
		//} 
		else {
			let temp = tempStr.split('/');
			return temp;
		}
	},

	//Live Skill

	thisCardLiveSkill: function () {
		return Template.instance().currentSCardDetail.get()?.skill?.liveSkill ?? [];
	},
	thisCardSupportSkill: function(){
		return Template.instance().currentSCardDetail.get()?.skill?.supportSkill ?? [];
	},
	thisSkillMaxLevel: function(){
		return findMaxSillLevel(this.skillLevel) ?? '';
	},
	thisCardIdeaNote: function(){
        return Template.instance().currentSCardDetail.get()?.idea?.ideaText ?? [];
    }
});

function strReplacement(strToReplace){
    strToReplace = strToReplace.replace(/条件/, "條件");
    strToReplace = strToReplace.replace(/確率/, '發動機率');
    strToReplace = strToReplace.replace(/最大/, '最多發動');
    strToReplace = strToReplace.replace(/ターン/, '回合');
    
    return strToReplace;
}

function findMaxSillLevel(skillLvArr){
	if(!skillLvArr.length) return null;
	let maxLV = 0;
	skillLvArr.forEach(element => {
		if (Number(element) > maxLV) maxLV = Number(element);
	});
	return maxLV;
}

