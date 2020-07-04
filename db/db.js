import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const idols = new Mongo.Collection('idols');
export const units = new Mongo.Collection('units');
