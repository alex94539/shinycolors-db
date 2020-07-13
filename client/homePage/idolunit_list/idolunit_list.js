import { Meteor } from "meteor/meteor";
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './idolunit_list.html';


Template.idolunit_list.onCreated(function () {
	this.baseData = new ReactiveDict();
	this.baseData.set('units', []);

	Meteor.call('getUnits', [], (err, result) => {
		this.baseData.set('units', result);
	});
	Meteor.call('getIdols', [], (err, result) => {
		this.baseData.set('idols', result);
	});
});

Template.idolunit_list.helpers({
	units: function () {
		if (!Template.instance().baseData.get('units')) {
			return [];
		} else {
			return Template.instance().baseData.get('units');
		}
	},
	idols: function () {
		if (!Template.instance().baseData.get('idols')) return [];
		let thisUnit = this.use;
		let thisUnitIdols = Template.instance()
			.baseData.get('idols')
			.filter((element) => {
				return element.unit === thisUnit;
			});
		return thisUnitIdols;
    },
    
});

Template.idolunit_list.events({
	'click .gotoUnit'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		FlowRouter.go(`/unit/${this.use}`);
	},
	'click .gotoIdol'(event, instance) {
		event.preventDefault();

		FlowRouter.go(`/idol/${this.name}`);
	},
});