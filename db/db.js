import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const idols = new Mongo.Collection('idols');
export const units = new Mongo.Collection('units');
export const SSSR = new Mongo.Collection('S_SSR');
export const SSR = new Mongo.Collection('S_SR');
export const SR = new Mongo.Collection('S_R');

export const idolCards = new Mongo.Collection('idolCards');
export const idolDetail = new Mongo.Collection("idolDetail");
export const idolCardsDetail = new Mongo.Collection('idolCardsDetail');

export const bigPic = new Mongo.Collection('bigPic');