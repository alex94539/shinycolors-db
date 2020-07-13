import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from "meteor/kadira:flow-router";
import { Tracker } from "meteor/tracker";


import '../../router/router.js';

import './main.html';


Template.body.onCreated(function() {
    Tracker.autorun(() => {
        FlowRouter.watchPathChange();
    });
});

Template.body.helpers({

});

Template.body.events({
    'click #mainPageButton_toMainPage'(event, instance){
        event.preventDefault();

        //FlowRouter.go('homePage');
    }
});