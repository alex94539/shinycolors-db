import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Base64 } from 'js-base64';
import { Meteor } from 'meteor/meteor';

    

import '../client/homePage/introduce_unit/introduce_unit.js';
import '../client/homePage/introduce_idol/introduce_idol.js';
import '../client/homePage/idolunit_list/idolunit_list.js';
import '../client/PCards/PCardSingle.js';
import '../client/SCards/SCardSingle.js';
import '../client/judgeTendency/judgeTendency.js';
import '../client/otherPages/otherPages.js';
import '../client/PCardsOverview/PCardsOverview.js';
import '../client/SCardsOverview/SCardsOverview.js';

FlowRouter.route('/', {
    name: 'homePage',
    triggersEnter: [function() {
		
	}],
    action: function(params, queryParams) {
		
        //BlazeLayout.render('idolunit_list', {});
	},
	triggersExit: [function() {
		DocHead.removeDocHeadAddedTags();
	}]
});

FlowRouter.route('/unit/:unitName', {
    name: 'unit',
    triggersEnter: [function() {}],
    action: function(params, queryParams) {
        DocHead.setTitle(params.unitName);
        BlazeLayout.setRoot('#mainPage_descArea');
        BlazeLayout.render('introduce_unit', {});
    },
    triggersExit: [function() {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/idol/:idolName', {
    name: 'idol',
    triggersEnter: [function() {}],
    action: function(params, queryParams) {
        DocHead.setTitle(params.idolName);
        BlazeLayout.setRoot("#mainPage_descArea");
        BlazeLayout.render("introduce_idol", {});
    },
    triggersExit: [function() {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/PCardDetail/:cardName', {
	name: 'PCardDetail',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		DocHead.setTitle(Base64.decode(params.cardName));
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('PCardSingle', {});
	},
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/SCardDetail/:cardName', {
	name: 'SCardDetail',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		DocHead.setTitle(Base64.decode(params.cardName));
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('SCardSingle', {});
	},
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/PCardsOverview', {
    name: 'PCardsOverview',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('PCardsOverview', {});
	},
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/SCardsOverview', {
    name: 'SCardsOverview',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('SCardsOverview', {});
	},
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/judgeTendency', {
	triggersEnter: [function () {}],
    action: function(params, queryParams){
        Meteor.call('getNextCardToJudge', [], (err, result) => {
            const path = FlowRouter.path("judgeTendency", {cardName: Base64.encodeURI(result.cardName), uuidAuth: result.uuidAuth});
			FlowRouter.go(path);
			delete path;
        });
    },
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/judgeTendency/:cardName/:uuidAuth', {
    name: 'judgeTendency', 
	triggersEnter: [function () {}],
    action: function(params, queryParams){
        DocHead.setTitle(Base64.decode(params.cardName));
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('judgeTendency', {});
    },
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/noSuchCards', {
    name: 'noSuchCards', 
	triggersEnter: [function () {}],
    action: function(params, queryParams){
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('noSuchCards', {});
    },
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});

FlowRouter.route('/rejected', {
    name: 'rejected', 
	triggersEnter: [function () {}],
    action: function(params, queryParams){
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('403Error', {});
    },
	triggersExit: [function () {
		DocHead.removeDocHeadAddedTags();
	}],
});