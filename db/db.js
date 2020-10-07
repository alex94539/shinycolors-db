import { Mongo } from 'meteor/mongo';

export const idols = new Mongo.Collection('idols');
export const units = new Mongo.Collection('units');

export const idolCards = new Mongo.Collection('idolCards');
export const idolDetail = new Mongo.Collection("idolDetail");
export const idolCardsDetail = new Mongo.Collection('idolCardsDetail');

//pic uuid storage
export const bigPic = new Mongo.Collection('bigPic');

//tendency DB
export const tendency = new Mongo.Collection('tendency');

//tendency Judge
export const tendencyJudge = new Mongo.Collection('tendencyJudge');

//produce Event
export const produceEvents = new Mongo.Collection('produceEvents');

//first time start up
export const init = new Mongo.Collection('init');

//db last backup time
export const backupTime = new Mongo.Collection('backupTime');