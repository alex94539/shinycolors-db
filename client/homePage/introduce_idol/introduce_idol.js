import { Template } from "meteor/templating";
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from "meteor/kadira:flow-router";
import { ReactiveVar } from "meteor/reactive-var";
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './introduce_idol.html';


Template.introduce_idol.onCreated(function() {
    this.thisIdol = new ReactiveVar('');
    this.thisIdolDetail = new ReactiveVar();
    this.thisIdolPicType = new ReactiveVar(0);
    this.thisIdolCards = new ReactiveVar();
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();
        if(FlowRouter.getRouteName() !== 'idol') {
            Blaze.remove(this.view);
            return;
        }

        this.thisIdol.set(FlowRouter.current().params.idolName);
        this.thisIdolPicType.set(0);

        Meteor.call('getIdolDetail', {name: FlowRouter.current().params.idolName}, (err, result) => {
			//console.log(result[0]);
			this.thisIdolDetail.set(result[0]);
		});
        Meteor.call('getThisIdolCard', {name: FlowRouter.current().params.idolName}, (err, result) => {
			this.thisIdolCards.set(result[0]);
			//console.log(result);
		});
    });
});

Template.introduce_idol.helpers({
    thisIdolName(){
        return Template.instance().thisIdol.get();
    },
    thisIdolNick(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().nick;
    },
    thisUnit(){
        let idolMap = {
            イルミネーションスターズ: "illumination STARS",
            アンティーカ: "L'Antica",
            放課後クライマックスガールズ: "放課後クライマックスガールズ",
            アルストロメリア: "ALSTROEMERIA",
            ストレイライト: "Straylight",
            ノクチル: "noctchill"
        }
        if(!Template.instance().thisIdolDetail.get()) return '';
        return idolMap[Template.instance().thisIdolDetail.get().unit];
    },
    thisIdolPicType(){
        let picType = ["private", "live", "same"];

        return picType[Template.instance().thisIdolPicType.get()];
    },
    thisIdolAge(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().age;
    },
    thisIdolBloodType(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().bloodType;
    },
    thisIdolBirth(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().birth;
    },
    thisIdolStarSign(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().starSign;
    },
    thisIdolLength(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().length;
    },
    thisIdolWeight(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().weight;
    },
    thisIdolThreeSize(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().threesize;
    },
    thisIdolHand(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().hand;
    },
    thisIdolBirthPlace(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().birthPlace;
    },
    thisIdolInterest(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().interest;
    },
    thisIdolSkill(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().skill;
    },
    thisIdolCV(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolDetail.get().CV;
    },
    thisIdolCards(){
        if(!Template.instance().thisIdolDetail.get()) return '';
        return Template.instance().thisIdolCards.get();
    },

    //do the base64 encode
    base64: function(){
        if (!Template.instance().thisIdolDetail.get()) return '';
        return Base64.encodeURI(this.cardName);
    }
});

Template.introduce_idol.events({
    'click #thisIdolPicFireEvent'(event, instance){
        event.preventDefault();

        let nextPic = instance.thisIdolPicType.get() + 1 < 3 ? instance.thisIdolPicType.get() + 1 : 0;

        instance.thisIdolPicType.set(nextPic);
    }
});

Template.introduce_idol.onDestroyed(function() {
    console.log('idol Kaboom!');
});