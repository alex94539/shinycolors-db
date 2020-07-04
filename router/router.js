import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../client/introduce_unit/introduce_unit.js';

FlowRouter.route('/', {

});

FlowRouter.route('/unit/:unitName', {
    name: 'unit',
    triggersEnter: [function() {}],
    action: function(params, queryParams) {
        console.log(params, queryParams);
        DocHead.setTitle(params.unitName);
        BlazeLayout.setRoot('#mainPage_descArea')
        BlazeLayout.render('introduce_unit', {})
    },
    triggersExit: [function() {}],
});

FlowRouter.route('/idol/:idolName', {
    name: 'idol',
    triggersEnter: [function() {}],
    action: function() {
        BlazeLayout.render('')
    },
    triggersExit: [function() {}],
});


