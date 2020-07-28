import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from "meteor/kadira:flow-router";
import { Tracker } from "meteor/tracker";
import { DocHead } from 'meteor/kadira:dochead';

import '../../router/router.js';

import './main.html';


Template.body.onCreated(function() {
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();

        DocHead.addMeta({name: 'description', content: 'A DataBase for Shinycolors developed by Euphokumiko.'});
        
        DocHead.addMeta({itemprop: 'name', content: 'A DataBase for Shinycolors developed by Euphokumiko.'});
    });
});

Template.body.helpers({

});

Template.body.events({
    'click #mainPageButton_toMainPage'(event, instance){
        event.preventDefault();

        //FlowRouter.go('homePage');
    },
    'click #mainPageButton_toPCardsOverview'(event, instance){
        event.preventDefault();

        FlowRouter.go('PCardsOverview');
    },
    'click #mainPageButton_toSCardsOverview'(event, instance){
        event.preventDefault();

        FlowRouter.go('SCardsOverview');
    }
});