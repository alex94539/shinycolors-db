import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from "meteor/tracker";
import { Base64 } from 'js-base64';

import './PCardsOverview.html';


Template.PCardsOverview.onCreated(function(){
    this.currentFilterResult = new ReactiveVar([]);

    Meteor.call('produceCardFilterQuery', {queryObj: {}}, (err, result) => {
        this.currentFilterResult.set(result);
    });
});

Template.PCardsOverview.helpers({
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
        return 
    },
    thisResultLink: function(){
        return Base64.encodeURI(this.cardName);
    }
});

Template.PCardsOverview.events({
    'submit #thisFilterForm'(event, instance){
        event.preventDefault();

        let formObj = {};

        instance.findAll('input:checkbox').forEach(element => {
            if(element.checked){
                formObj[element.id] = element.checked;
            }
        });

        console.log(formObj);

        Meteor.call('produceCardFilterQuery', {queryObj: formObj}, (err, result) => {
            instance.currentFilterResult.set(result);

            instance.find('#thisFilterForm').style.display = 'none';
            instance.find('#thisFilterCards').style.display = 'block';
        });
    }
});