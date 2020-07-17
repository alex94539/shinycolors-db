import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const idols = new Mongo.Collection('idols');
export const units = new Mongo.Collection('units');

export const idolCards = new Mongo.Collection('idolCards');
export const idolDetail = new Mongo.Collection("idolDetail");
export const idolCardsDetail = new Mongo.Collection('idolCardsDetail');

export const bigPic = new Mongo.Collection('bigPic');


export const init = new Mongo.Collection('init');