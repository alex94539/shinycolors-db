import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Base64 } from 'js-base64';

import './judgeTendencyS.html';

const supportSkill = require('../../imports/jsons/supportSkill.json');
const idolDetail = require('../../imports/jsons/idolDetail.json');

Template.judgeTendencyS.onCreated(function(){
    this.currentCard = new ReactiveVar();
    this.currentCardDetail = new ReactiveVar();
    this.supportSkill = new ReactiveVar(supportSkill);
    this.currentCount = new ReactiveVar(0);
    Tracker.autorun(() => {
        
        FlowRouter.watchPathChange();
        if(FlowRouter.getRouteName() !== 'judgeTendencyS') {
            Blaze.remove(this.view);
            return;
        }
		const card = Base64.decode(FlowRouter.current().params.cardName);
		console.log(card);
        this.currentCard.set(card);
        Meteor.call('checkThisCardIsJudged', {cardName: this.currentCard.get()}, (err, result) => {
            if(result){
                Meteor.call('getNextCardToJudge', [], (err, result) => {
                    const path = FlowRouter.path("judgeTendencyS", {cardName: Base64.encodeURI(result.cardName), uuidAuth: result.uuidAuth});
                    FlowRouter.go(path);
                });
            }
        });

        Meteor.call('getCardDetail',{cardName: this.currentCard.get(), uuidAuth: FlowRouter.current().params.uuidAuth},  (err, result) => {
            if(!result){
                FlowRouter.go('rejected');
            }
            console.log(result[0]);
            this.currentCardDetail.set(result[0]);
            typeToggleCheckBox(result[0].type, this);
            ideaToggleCheckBox(result[0].idea.ideaType, this);
            hiramekiToggleCheckBox(result[0].idol, this);
            result[0].panel[20].forEach(element => {
                toggleCheckBox(element, this);
            });
            result[0].panel[30].forEach(element => {
                toggleCheckBox(element, this);
            });
            if(result[0].type.match(/_N$/)) return;
            result[0].panel[40].forEach(element => {
                toggleCheckBox(element, this);
            });
            if(result[0].type.match(/_R$/)) return;
            result[0].panel[50].forEach(element => {
                toggleCheckBox(element, this);
            });
        });

       
    });
});

Template.judgeTendencyS.onRendered(function(instance) {
    Tracker.autorun(() => {
        let thisCardSkill = this.currentCardDetail.get()?.skill?.supportSkill ?? [];
        setTimeout(() => {
            thisCardSkill.forEach((element, index) => {
                supportSkill.mainSkill.forEach(ele => {
                    if(element.skillName.match(ele.skillName)){
                        this.find(`#mainSkill${index}`).value = ele.skillName;
                        if(ele.type == 'noOption'){
                            this.find(`#subOption${index}`).disabled = true;
                        }
                    }
                });
            });
        }, 2000);
        setTimeout(() => {
            thisCardSkill.forEach((element, index) => {
                for(let k = supportSkill.subOption.length - 1; k >= 0; k--){
                    if(element.skillName.match(supportSkill.subOption[k].optionabbr)){
                        this.find(`#subOption${index}`).value = supportSkill.subOption[k].optionabbr;
                    }
                }
            });
        }, 3000);
        /*
        thisCardSkill.forEach((element, index) => {
            supportSkill.mainSkill.forEach(ele => {
                if(element.skillName.match(ele.skillName)){
                    //console.log(`#mainSkill${index}`, this.find(`#mainSkill${index}`))
                    //this.$(`#mailSkill${index}`).value = ele.skillName;
                }
            });
        });
        */
    });
});

Template.judgeTendencyS.helpers({
    thisCardName: function(){
        return Template.instance().currentCardDetail.get()?.cardName ?? '';
    },
	sliceSkillDesc: function () {
		if (!Template.instance().currentCardDetail.get()) return [];
		//console.log(this);
		if (this.skillTitle.match(/(Visual\d+%UP)|(Vocal\d+%UP)|(Dance\d+%UP)|(メンタルダメージ\d+%CUT)|(メンタル\d+%回復)|(思い出ゲージ\d+%UP)|(注目度\d+%DOWN)|(Vo&Da&Vi\d+%UP)|(Vocal&Dance&Visual\d+%UP)/)) {
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
            return;
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
    thisCardSupSkill: function () {
        return Template.instance().currentCardDetail.get()?.skill?.supportSkill ?? [];
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
        if (Template.instance().currentCardDetail.get() && (Template.instance().currentCardDetail.get().type === 'P_SR' || Template.instance().currentCardDetail.get().type === 'S_SR')) {
			return true;
        }
        else {
            return false;
        }
    },
    supportSkills: function(par) {
        let supSkills = Template.instance().supportSkill.get()?.mainSkill;
        let cardSkills = Template.instance().currentCardDetail.get()?.skill?.supportSkill;
        if(!supSkills){
            return [];
        }
        else{
            /*
            supSkills.forEach(element => {
                if(element.skillName.match(cardSkills[par].skillName)){
                    element.selected = 'selected';
                }
            });
            */
            return supSkills;
        }
        
        //return Template.instance().supportSkill.get()?.mainSkill ?? [];
    },
    subOptions: function(par){
        return Template.instance().supportSkill.get()?.subOption ?? [];
    },
    thisSkill: function(par){
        //console.log(par)
    },
    thisCardLiveSkill: function(){
        return Template.instance().currentCardDetail.get()?.skill.liveSkill ?? [];
    }
});

Template.judgeTendencyS.events({
	'submit #thisCardSubmitForm'(event, instance){
        event.preventDefault();
        let flag = false;
        let formObj = new Object();

        instance.findAll('input:checkbox').forEach(element => {
            formObj[element.id] = element.checked;
        });
        formObj.idol = instance.currentCardDetail.get().idol;
        formObj.cardName = instance.currentCard.get();
        formObj.uuidAuth = FlowRouter.current().params.uuidAuth;

        for(let k = 0; k < instance.currentCardDetail.get().skill.supportSkill.length; k++){
            let thisSkill = instance.find(`#mainSkill${k}`).value;
            let subOption = instance.find(`#subOption${k}`).value;

            if(thisSkill == '' /*|| subOption == '--請選擇--'*/){
                alert('技能選項錯誤');
                flag = true;
                break;
            }
            formObj[`support${thisSkill + subOption}`] = true;
        }

        if(flag) {
            return;
        }
        console.log(formObj);
        /*
        Meteor.call('insertJudgeResultToDB', {judgedObj: formObj}, (err, result) => {
            if(result){
                const keepJudging = confirm('是否要繼續前往下一張卡片?');
                if(keepJudging){
                    Meteor.call('getNextCardToJudge', [], (err, result) => {
                        BlazeLayout.reset();
                        BlazeLayout.render()
                        FlowRouter.setParams({cardName: Base64.encodeURI(result.cardName), uuidAuth: result.uuidAuth})
                        
                    });
                }
                else{
                    FlowRouter.go('homePage');
                }
            }
            else{
                FlowRouter.go('rejected');
            }
        });
        */
    },
    'change .mainSkill'(event, instance){
        event.preventDefault();
        //console.log(event)
        toggleDisabled(instance, event.target.value, event.currentTarget.id)
    }
});

function toggleCheckBox(element, instance){
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
    if(element.skillDesc.match(/メンタルが多いほど効果UP|メンタルが多い程効果UP/)){
        instance.find('#skillHighMeHurt').checked = true;
    }
    if(element.skillDesc.match(/メンタルが少ないほど効果UP|メンタルが少ない程効果UP/)){
        instance.find('#skillLowMeHurt').checked = true;
    }
    if(element.skillDesc.match(/思い出ゲージが多いほど効果UP|思い出ゲージが多い程効果UP/)){
        instance.find('#skillHighOmoideHurt').checked = true;
    }
    if(element.skillDesc.match(/注目度が高いほど効果UP|注目度が高い程効果UP/)){
        instance.find('#skillHighFocusHurt').checked = true;
    }
    if(element.skillDesc.match(/注目度が低いほど効果UP|注目度が低い程効果UP/)){
        instance.find('#skillLowFocusHurt').checked = true;
    }

    if(element.skillTitle.match(/Vocal.*\d+%UP|Vo.*\d+%UP/)){
        instance.find('#skillVoUp').checked = true;
    }
    if(element.skillTitle.match(/Dance.*\d+%UP|Da.*\d+%UP/)){
        instance.find('#skillDaUp').checked = true;
    }
    if(element.skillTitle.match(/Visual.*\d+%UP|Vi.*\d+%UP/)){
        instance.find('#skillViUp').checked = true;
    }

    if(element.skillDesc.match(/思い出ゲージ\d+%UP/) || element.skillTitle.match(/思い出ゲージ\d+%UP/)){
        instance.find('#skillOmoiGaugeUp').checked = true;
    }
    if(element.skillDesc.match(/思い出ゲージ\d+%DOWN/) || element.skillTitle.match(/思い出ゲージ\d+%DOWN/)){
        instance.find('#skillOmoiGaugeDown').checked = true;
    }
    if(element.skillDesc.match(/メンタル\d+%回復/) || element.skillTitle.match(/メンタルダメージ\d+%回復/) || element.skillTitle.match(/メンタル\d+%回復/)){
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

function typeToggleCheckBox(data, instance){
    if(data.match(/^P_/)){
        instance.find('#typeProduce').checked = true;
    }
    if(data.match(/^S_/)){
        instance.find('#typeSupport').checked = true;
    }
    if(data.match(/_SSR$/)){
        instance.find('#raritySSR').checked = true;
    }
    if(data.match(/_SR$/)){
        instance.find('#raritySR').checked = true;
    }
    if(data.match(/_R$/)){
        instance.find('#rarityR').checked = true;
    }
    if(data.match(/_N$/)){
        instance.find('#rarityN').checked = true;
    }
}

function ideaToggleCheckBox(type, instance){
    switch (type){
        case 'vocal':
            instance.find('#noteVocal').checked = true;
            break;

        case 'dance':
            instance.find('#noteDance').checked = true;
            break;

        case 'visual':
            instance.find('#noteVisual').checked = true;
            break;

        case 'talk':
            instance.find('#noteTalk').checked = true;
            break;

        case 'appeal':
            instance.find('#noteAppeal').checked = true;
            break;
            
    }

}

function hiramekiToggleCheckBox(idolName, instance){
    idolDetail.forEach(element => {
        if(idolName.match(element.name)){
            switch(element.hirameki){
                case 'Vo':
                    instance.find('#hiramekiVo').checked = true;
                    break;
                case 'Da':
                    instance.find('#hiramekiDa').checked = true;
                    break;
                case 'Vi':
                    instance.find('#hiramekiVi').checked = true;
                    break;
                case 'Me':
                    instance.find('#hiramekiMe').checked = true;
                    break;
                default: 
                    alert('此卡資料發生問題');
            }
        }
    });
}

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
