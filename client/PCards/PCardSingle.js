import { Meteor } from "meteor/meteor";
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './PCardSingle.html';

Template.PCardSingle.onCreated(function(){
    Tracker.autorun(() => {
        this.currentPCard = new ReactiveVar();
        this.currentPCardDetail = new ReactiveVar();
        this.currentPCardPicArr = new ReactiveVar();
		this.currentPCardPicCount = new ReactiveVar(1);
		this.currentIdolProduceEvents = new ReactiveVar([]);
        FlowRouter.watchPathChange();
        if(FlowRouter.getRouteName() !== 'PCardDetail') {
            Blaze.remove(this.view);
            return;
        }
		const card = Base64.decode(FlowRouter.current().params.cardName);
		console.log(card);
        this.currentPCard.set(card);

        Meteor.call('getPCardSingleDetail',{cardName: this.currentPCard.get()},  (err, result) => {
            if(!result.length){
				FlowRouter.go('noSuchCards');
            }
            this.currentPCardDetail.set(result[0]);
            console.log(result);
        });

        Meteor.call('getThisCardImage', {cardName: this.currentPCard.get().replace(/【/, '').replace(/】/, ' ')}, (err, result) => {
			//console.log(result);
			this.currentPCardPicArr.set(result);
			this.currentPCardPicCount.set(1);
		});

		let thisIdol = card.match(/【.*】(.*)/)[1];
		Meteor.call('getThisIdolProduceEvents', {thisIdol: thisIdol}, (err, result) => {
			console.log(result);
			this.currentIdolProduceEvents.set(result);
		});
    });
});

Template.PCardSingle.helpers({
	sliceSkillDesc: function () {
		if (!Template.instance().currentPCardDetail.get()) return [];
		//console.log(this);
		if (this.skillTitle.match(/(Visual\d+%UP)|(Vocal\d+%UP)|(Dance\d+%UP)|(メンタルダメージ\d+%CUT)|(メンタル\d+%回復)|(思い出ゲージ\d+%UP)|(注目度\d+%DOWN)|(Vo&Da&Vi\d+%UP)|(Vocal&Dance&Visual\d+%UP)/)) {
            if(this.skillDesc.match(/\[.*?\]/g).length < 3){
                return ['', this.skillDesc.match(/\[.*?\]/g)[0], ''];
            }
            else{
                return this.skillDesc.match(/\[.*?\]/g);
            }
		} else if (this.skillTitle.match(/(メンタル上限UP)|(Vocal上限UP)|(Visual上限UP)|(Dance上限UP)|(Vo&Da&Vi上限UP)/)) {
			return [this.skillDesc];
		} else {
			
			let temp = this.skillDesc.match(/(.*)(\(Link\).*)/);
			return [...(temp[1].split('/')), temp[temp.length - 1]];
		}
	},
	thisCardIdolEvents: function () {
		return Template.instance().currentPCardDetail.get()?.events ?? [];
	},

	thisCardName: function () {
		return Template.instance().currentPCardDetail.get()?.cardName ?? '';
    },
    thisCardImage: function(){
        return Template.instance().currentPCardPicArr.get()[Template.instance().currentPCardPicCount.get()]?.uuid ?? '';
    },
	thisCardSkill20: function () {
		return Template.instance().currentPCardDetail.get()?.panel[20] ?? [];
	},
	thisCardSkill30: function () {
		return Template.instance().currentPCardDetail.get()?.panel[30] ?? [];
	},
	thisCardSkill40: function () {
		return Template.instance().currentPCardDetail.get()?.panel[40] ?? [];
	},
	thisCardSkill50: function () {
		return Template.instance().currentPCardDetail.get()?.panel[50] ?? [];
    },
    thisCardTrueEnd: function(){
        return Template.instance().currentPCardDetail.get()?.trueEnd.eventName ?? false;
    },

	has40SPSkill: function () {
		if (!Template.instance().currentPCardDetail.get() || Template.instance().currentPCardDetail.get().type === 'S_N') {
			return false;
		} else {
			return true;
		}
	},
	has50SPSkill: function () {
		if (!Template.instance().currentPCardDetail.get() || Template.instance().currentPCardDetail.get().type === 'S_N' || Template.instance().currentPCardDetail.get().type === 'S_R') {
			return false;
		} else {
			return true;
		}
	},

	event3Option: function () {
		if (this.eventType === '3options') {
			return true;
		} else {
			return false;
		}
	},
	event0Option: function () {
		if (this.eventType === '0options') {
			return true;
		} else {
			return false;
		}
	},

	cellColor: function () {
		//console.log(this);
        if (this.skillTitle.match(/メンタルダメージ\d+%CUT/)) return 'classVi';
		if (this.skillTitle.match(/Vocal.*Dance/)) return 'classVoDa';
		if (this.skillTitle.match(/Vocal.*Visual/)) return 'classVoVi';
		if (this.skillTitle.match(/Dance.*Visual/)) return 'classDaVi';
		if (this.skillTitle.match(/Vocal/)) return 'classVo';
		if (this.skillTitle.match(/Dance/)) return 'classDa';
        if (this.skillTitle.match(/Visual/)) return 'classVi';
        if (this.skillTitle.match(/メンタル/)) return 'classMe'
	},
	SRColSpan: function(){
        if (!Template.instance().currentPCardDetail.get() 
        || Template.instance().currentPCardDetail.get().type === 'P_N'
        || Template.instance().currentPCardDetail.get().type === 'P_R'
        || Template.instance().currentPCardDetail.get().type === 'P_SSR') {
			return false;
        }
        else {
            return true;
        }
    },


    thisCardOmoide: function(){
		return Template.instance().currentPCardDetail.get()?.memoryAppeal ?? '';
    },
    thisOmoideLinkSpan: function(){
        //console.log(this);
        if (this.appealName.match(/(.*[^\+]\+{2}$)/)) return 3;
		if (this.appealName.match(/.*[^+]$/)) return 2;
    },
    thisOmoideLink: function(){
        if (this.appealName.match(/\[.*\].*$/)) return false;
        if (this.appealName.match(/(.*[^\+]\+{2}$)/)) return Template.instance().currentPCardDetail.get().memoryLink[1];
        if (this.appealName.match(/.*[^+]$/)) return Template.instance().currentPCardDetail.get().memoryLink[0];
        return false;
    },
	thisIdolProduceEvents: function(){
		return Template.instance().currentIdolProduceEvents.get();
	},

	thisIdolEvents: function(){
		if(this.eventType !== "noChange"){
			return true;
		}
		else{
			return false;
		}
	},
	replaceNewLineBegin: function(){
		return this.beginning.replace('\n', '<br>')
	},
	replaceNewLineSelect: function(){
		return this.beforeSelection.replace('\n', '<br>')
	}
});

Template.PCardSingle.events({
    'click img'(event, instance){
        event.preventDefault();
        let nextIndex = instance.currentPCardPicCount.get() === 1 ? 0 : 1
		instance.currentPCardPicCount.set(nextIndex);
		instance.find('#thisCardPicLoading').style.display = 'block';
		instance.find('#thisCardBigPic').style.background = 'rgba(0,0,0,0.5)';
		instance.find('#thisCardBigPic').style['z-index'] = 40;
	},
	'load img'(event, instance){
		event.preventDefault();
		instance.find('#thisCardPicLoading').style.display = 'none';
		instance.find('#thisCardBigPic').style.background = 'transparent';
	},
	'submit #thisCardSubmitForm'(event, instance){
		event.preventDefault();

		const vi = event.target.ViTendency.checked;
		console.log(vi);
	},
	'click #cardIdolEvent'(event, instance){
		event.preventDefault();

		if(instance.find('#cardIdolEventContent').style.display === "block"){
			instance.find('#cardIdolEventContent').style.display = "none";
		}
		else{
			instance.find('#cardIdolEventContent').style.display = "block";
		}
	},
	'click #idolEvents'(event, instance){
		event.preventDefault();

		if(instance.find('#idolEventsContent').style.display === "block"){
			instance.find('#idolEventsContent').style.display = "none";
		}
		else{
			instance.find('#idolEventsContent').style.display = "block";
		}
	},
	'click #wingEvents'(event, instance){
		event.preventDefault();

		if(instance.find('#wingEventsContent').style.display === "block"){
			instance.find('#wingEventsContent').style.display = "none";
		}
		else{
			instance.find('#wingEventsContent').style.display = "block";
		}
	},
	'click #fanEvents'(event, instance){
		event.preventDefault();

		if(instance.find('#fanEventsContent').style.display === "block"){
			instance.find('#fanEventsContent').style.display = "none";
		}
		else{
			instance.find('#fanEventsContent').style.display = "block";
		}
	},
	'click #gradEvents'(event, instance){
		event.preventDefault();

		if(instance.find('#gradEventsContent').style.display === "block"){
			instance.find('#gradEventsContent').style.display = "none";
		}
		else{
			instance.find('#gradEventsContent').style.display = "block";
		}
	},
	'click #idolMorningCommu'(event, instance){
		event.preventDefault();

		if(instance.find('#idolMorningCommuContent').style.display === "block"){
			instance.find('#idolMorningCommuContent').style.display = "none";
		}
		else{
			instance.find('#idolMorningCommuContent').style.display = "block";
		}
	},
	'click #idolAudiCommu'(event, instance){
		event.preventDefault();

		if(instance.find('#idolAudiCommuContent').style.display === "block"){
			instance.find('#idolAudiCommuContent').style.display = "none";
		}
		else{
			instance.find('#idolAudiCommuContent').style.display = "block";
		}
	}
}); 

Template.PCardSingle.onDestroyed(function(){
    console.log('PCardSingle kaboom.');
});