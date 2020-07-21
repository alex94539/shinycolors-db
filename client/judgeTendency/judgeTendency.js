import { Meteor } from 'meteor/meteor';

import './judgeTendency.html';

Template.judgeTendency.onCreated(function(){
    Tracker.autorun(() => {
        this.currentCard = new ReactiveVar();
        this.currentCardDetail = new ReactiveVar();
        FlowRouter.watchPathChange();
        if(FlowRouter.getRouteName() !== 'judgeTendency') {
            Blaze.remove(this.view);
            return;
        }
		const card = Base64.decode(FlowRouter.current().params.cardName);
		console.log(card);
        this.currentCard.set(card);

        Meteor.call('getCardDetail',{cardName: this.currentCard.get()},  (err, result) => {
            if(!result.length){

            }
            this.currentCardDetail.set(result[0]);
            console.log(result);

            result[0].panel[20].forEach(element => {
                console.log('autorun', element);
                toggleCheckBox(element, this);
            });
            result[0].panel[30].forEach(element => {
                console.log('autorun', element);
                toggleCheckBox(element, this);
            });
            if(result[0].type.match(/_N$/)) return;
            result[0].panel[40].forEach(element => {
                console.log('autorun', element);
                toggleCheckBox(element, this);
            });
            if(result[0].type.match(/_R$/)) return;
            result[0].panel[50].forEach(element => {
                console.log('autorun', element);
                toggleCheckBox(element, this);
            });
        });

       
    });
});

Template.judgeTendency.onRendered(function() {
    Tracker.autorun(() => {
        
    });
});

Template.judgeTendency.helpers({
	sliceSkillDesc: function () {
		if (!Template.instance().currentCardDetail.get()) return [];
		//console.log(this);
		if (this.skillTitle.match(/(Visual\d+%UP)|(Vocal\d+%UP)|(Dance\d+%UP)|(メンタルダメージ\d+%CUT)|(メンタル\d+%回復)|(思い出ゲージ\d+%UP)|(注目度\d+%DOWN)|(Vo&Da&Vi\d+%UP)/)) {
            if(this.skillDesc.match(/\[.*?\]/g).length < 3){
                return ['', this.skillDesc.match(/\[.*?\]/g)[0], ''];
            }
            else{
                return this.skillDesc.match(/\[.*?\]/g);
            }
        } 
        else if (this.skillTitle.match(/(メンタル上限UP)|(Vocal上限UP)|(Visual上限UP)|(Dance上限UP)|(Vo&Da&Vi上限UP)|(.*)アピール/)
            || this.skillDesc.match(/(.*)アピール/)
        ) {
            return [this.skillDesc];
        }
        else if(this.skillDesc.match(/(.*)(\(Link\).*)/)){
			let temp = this.skillDesc.match(/(.*)(\(Link\).*)/);
			return [...(temp[1].split('/')), temp[temp.length - 1]];
        }
        else{
            return 
        }
	},
	thisCardIdolEvents: function () {
		return Template.instance().currentCardDetail.get()?.events ?? [];
	},

	thisCardName: function () {
		return Template.instance().currentCardDetail.get()?.cardName ?? '';
    },
	thisCardSkill20: function () {
		return Template.instance().currentCardDetail.get()?.panel[20] ?? [];
	},
	thisCardSkill30: function () {
		return Template.instance().currentCardDetail.get()?.panel[30] ?? [];
	},
	thisCardSkill40: function () {
		return Template.instance().currentCardDetail.get()?.panel[40] ?? [];
	},
	thisCardSkill50: function () {
		return Template.instance().currentCardDetail.get()?.panel[50] ?? [];
    },
    thisCardTrueEnd: function(){
        return Template.instance().currentCardDetail.get()?.trueEnd.eventName ?? false;
    },

	has40SPSkill: function () {
		if (!Template.instance().currentCardDetail.get() || Template.instance().currentCardDetail.get().type === 'S_N') {
			return false;
		} else {
			return true;
		}
	},
	has50SPSkill: function () {
		if (!Template.instance().currentCardDetail.get() || Template.instance().currentCardDetail.get().type === 'S_N' || Template.instance().currentCardDetail.get().type === 'S_R') {
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
        console.log(Template.instance().currentCardDetail.get().type);
        if (Template.instance().currentCardDetail.get() && (Template.instance().currentCardDetail.get().type === 'P_SR' || Template.instance().currentCardDetail.get().type === 'S_SR')) {
			return true;
        }
        else {
            return false;
        }
    },


    thisCardOmoide: function(){
		return Template.instance().currentCardDetail.get()?.memoryAppeal ?? '';
    },
    thisOmoideLinkSpan: function(){
        //console.log(this);
        if (this.appealName.match(/(.*[^\+]\+{2}$)/)) return 3;
		if (this.appealName.match(/.*[^+]$/)) return 2;
    },
    thisOmoideLink: function(){
        if (this.appealName.match(/\[.*\].*$/)) return false;
        if (this.appealName.match(/(.*[^\+]\+{2}$)/)) return Template.instance().currentCardDetail.get().memoryLink[1];
        if (this.appealName.match(/.*[^+]$/)) return Template.instance().currentCardDetail.get().memoryLink[0];
        return false;
    },


	inputTendency: function(){
		return true;
	}
});

Template.judgeTendency.events({
	'submit #thisCardSubmitForm'(event, instance){
		event.preventDefault();

		const vi = event.target.ViTendency.checked;
		console.log(vi);
	}
});

function toggleCheckBox(element, instance){
    console.log(element, instance);
    if(element.skillDesc.match(/Excellent(\d\.\d|\d)/)){
        instance.find('#skillExcellentAppeal').checked = true;
    }
    if(element.skillDesc.match(/全観客/)){
        instance.find('#skillAppealAll').checked = true;
    }
    if(element.skillDesc.match(/興味無視/)){
        instance.find('#skillIgnoreDefense').checked = true;
    }
    if(element.skillDesc.match(/一気に満足させる/)){
        instance.find('#skillChanceFulfill').checked = true;
    }
    if(element.skillDesc.match(/メンタルが多いほど効果UP/)){
        instance.find('#skillHighMeHurt').checked = true;
    }
    if(element.skillDesc.match(/メンタルが少ないほど効果UP/)){
        instance.find('#skillLowMeHurt').checked = true;
    }
    if(element.skillDesc.match(/思い出ゲージが多いほど効果UP/)){
        instance.find('#skillHighOmoideHurt').checked = true;
    }
    if(element.skillDesc.match(/注目度が高いほど効果UP|注目度が高い程効果UP/)){
        instance.find('#skillHighFocusHurt').checked = true;
    }
    if(element.skillDesc.match(/注目度が低いほど効果UP|注目度が低い程効果UP/)){
        instance.find('#skillLowFocusHurt').checked = true;
    }

    if(element.skillTitle.match(/Vocal\d+%UP/)){
        instance.find('#skillVoUp').checked = true;
    }
    if(element.skillTitle.match(/Dance\d+%UP/)){
        instance.find('#skillDaUp').checked = true;
    }
    if(element.skillTitle.match(/Visual\d+%UP/)){
        instance.find('#skillViUp').checked = true;
    }

    if(element.skillDesc.match(/思い出ゲージ\d+%UP/) || element.skillTitle.match(/思い出ゲージ\d+%UP/)){
        instance.find('#skillOmoiGaugeUp').checked = true;
    }
    if(element.skillDesc.match(/思い出ゲージ\d+%DOWN/) || element.skillTitle.match(/思い出ゲージ\d+%DOWN/)){
        instance.find('#skillOmoiGaugeDown').checked = true;
    }
    if(element.skillDesc.match(/メンタル\d+%回復/) || element.skillTitle.match(/メンタルダメージ\d+%回復/)){
        instance.find('#skillMeInc').checked = true;
    }
    if(element.skillDesc.match(/自身のメンタルを\d+%減らす/)){
        instance.find('#skillMeDec').checked = true;
    }
    if(element.skillDesc.match(/メンタルが0になった時\d+%回復/)){
        instance.find('#skillResurrect').checked = true;
    }
    if(element.skillDesc.match(/リラックス/)){
        instance.find('#skillRelax').checked = true;
    }
    if(element.skillDesc.match(/メランコリー/)){
        instance.find('#skillMelancholy').checked = true;
    }
    if(element.skillDesc.match(/メンタルダメージ\d+%CUT/) || element.skillTitle.match(/メンタルダメージ\d+%CUT/)){
        instance.find('#skillMeDamageCut').checked = true;
    }
    if(element.skillDesc.match(/メンタルダメージ\d+%UP/) || element.skillTitle.match(/メンタルダメージ\d+%UP/)){
        instance.find('#skillMeDamageUp').checked = true;
    }
    if(element.skillDesc.match(/注目度\d+%UP/) || element.skillTitle.match(/注目度\d+%UP/)){
        instance.find('#skillFocusUp').checked = true;
    }
    if(element.skillDesc.match(/注目度\d+%DOWN/) || element.skillTitle.match(/注目度\d+%DOWN/)){
        instance.find('#skillFocusDown').checked = true;
    }
    if(element.skillDesc.match(/リアクション回避率\d+%UP/) || element.skillTitle.match(/リアクション回避率\d+%UP/)){
        instance.find('#skillReactionDodgeUp').checked = true;
    }
    if(element.skillDesc.match(/\dターンの間回避時(Vocal|Dance|Visual)\d+%UP/)){
        instance.find('#skillGiveStatusOnDodge').checked = true;
    }
    if(element.skillDesc.match(/興味\d+%UP/)){
        instance.find('#skillInterestUp').checked = true;
    }
    if(element.skillDesc.match(/興味\d+%DOWN/)){
        instance.find('#skillInterestDown').checked = true;
    }
    if(element.skillDesc.match(/影響力\d+%DOWN/)){
        instance.find('#skillAffectDown').checked = true;
    }
    if(element.skillDesc.match(/ダメージを受けるまで/)){
        instance.find('#skillUntilDamaged').checked = true;
    }
    if(element.skillDesc.match(/PERFECTなら(\d|\d\.\d)倍アピール/)){
        instance.find('#skillOnPerfect').checked = true;
    }
    if(element.skillDesc.match(/必ず最初にアピール/)){
        instance.find('#skillFirstAppeal').checked = true;
    }
    if(element.skillDesc.match(/必ず最後にアピール/)){
        instance.find('#skillLastAppeal').checked = true;
    }
}