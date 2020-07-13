import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Base64 } from 'js-base64';
    

import '../client/homePage/introduce_unit/introduce_unit.js';
import '../client/homePage/introduce_idol/introduce_idol.js';
import '../client/homePage/idolunit_list/idolunit_list.js';
import '../client/PCards/PCardSingle.js';
import '../client/SCards/SCardSingle.js';

FlowRouter.route('/', {
    name: 'homePage',
    triggersEnter: [],
    action: function(params, queryParams) {
        DocHead.setTitle('ShinyColors');
        //BlazeLayout.render('idolunit_list', {});
    }
});

FlowRouter.route('/unit/:unitName', {
    name: 'unit',
    triggersEnter: [function() {}],
    action: function(params, queryParams) {
        DocHead.setTitle(params.unitName);
        BlazeLayout.setRoot('#mainPage_descArea');
        BlazeLayout.render('introduce_unit', {});
    },
    triggersExit: [function() {}],
});

FlowRouter.route('/idol/:idolName', {
    name: 'idol',
    triggersEnter: [function() {}],
    action: function(params, queryParams) {
        DocHead.setTitle(params.idolName);
        BlazeLayout.setRoot("#mainPage_descArea");
        BlazeLayout.render("introduce_idol", {});
    },
    triggersExit: [function() {}],
});

FlowRouter.route('/PCardDetail/:cardName', {
	name: 'PCardDetail',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		DocHead.setTitle(Base64.decode(params.cardName));
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('PCardSingle', {});
	},
	triggersExit: [function () {}],
});

FlowRouter.route('/SCardDetail/:cardName', {
	name: 'SCardDetail',
	triggersEnter: [function () {}],
	action: function (params, queryParams) {
		DocHead.setTitle(Base64.decode(params.cardName));
		BlazeLayout.setRoot('#mainPage_descArea');
		BlazeLayout.render('SCardSingle', {});
	},
	triggersExit: [function () {}],
});