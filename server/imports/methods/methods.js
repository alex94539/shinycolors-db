import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { v4 as uuidv4 } from 'uuid';

import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic, tendencyJudge, tendency } from '../../../db/db.js';
import { judgeObjStructure } from './checkJudgeObjStructure.js';
import { filterObjStructure } from './checkFilterObjStructure.js';


Meteor.methods({
	getIdols() {
		//console.log(idols.find({}));
		return idols.find({}).fetch();
	},
	getUnits() {
		return units.find({}).fetch();
	},
	getIdolDetail({name}) {
		//if (name.match('\$')) return [];
		check(name, String);
		return idolDetail.find({name: name}).fetch();
	},
	getThisIdolCard({name}) {
		//if (name.match('\$')) return []; // name.match('\$') !check(name, String)
		return idolCards.find({name: name}).fetch();
	},
    getThisCardImage({cardName}){
		let reg = new RegExp(cardName);
		//console.log(cardName);
        return bigPic.find({$query: {cardName: reg}, $orderby: {cardName: 1}}).fetch();
	},
	
	//PCardSingle
	getPCardSingleDetail({cardName}) {
		console.log(cardName);
		return idolCardsDetail.find({cardName: cardName, type: /P/}).fetch();
	},

	//SCardSingle
	getSCardSingleDetail({cardName}) {
		return idolCardsDetail.find({cardName: cardName, type: /S/}).fetch();
	},

	//judgeTendency
	getCardDetail({cardName, uuidAuth}){
		const uuidCheck = tendencyJudge.findOne({cardName: cardName, uuidAuth: uuidAuth});
		if(!uuidCheck) {
			return false;
		}
		else{
			return idolCardsDetail.find({cardName: cardName}).fetch();
		}
	},
	getNextCardToJudge(){
		const toJudge = tendencyJudge.findOne({isJudged: false, lastActive: null, type: /P_/});
		const thisuuid = uuidv4();
		tendencyJudge.update({_id: toJudge._id}, {$set: {lastActive: new Date(), uuidAuth: thisuuid}});
		return {...toJudge, uuidAuth: thisuuid};
	},
	checkThisCardIsJudged({cardName}){
		const checkJudged = tendencyJudge.findOne({cardName: cardName});
		if(!checkJudged.isJudged){
			return false;
		}
		else{
			return true;
		}
	},
	insertJudgeResultToDB({judgedObj}){
		try{//檢查送進來的資料的結構
			check(judgedObj, judgeObjStructure);
		}
		catch(error) {
			if(error){
				console.log('rejected in tryCatch');
				return false;
			}
			
		}
		//檢查tendency不得為空
		if(!judgedObj.ViTendency && !judgedObj.VoTendency && !judgedObj.DaTendency && !judgedObj.MeTendency){
			console.log('rejected in tendency check');
			return false;
		}

		//檢查uuid
		const uuidCheck = tendencyJudge.findOne({cardName: judgedObj.cardName, uuidAuth: judgedObj.uuid});
		if(!uuidCheck){
			console.log('rejected in uuidCheck');
			return false;
		}
		delete judgedObj.uuidAuth;

		tendencyJudge.update({cardName: judgedObj.cardName, uuidAuth: judgedObj.uuid}, {$set: {isJudged: true}});

		tendency.insert(judgedObj);
		return true;
	},
	produceCardFilterQuery({queryObj}){
		/*
		try {
			check(queryObj, filterObjStructure);
		} catch (error) {
			if(error){
				return [];
			}
		}
		*/
		return tendency.find({...queryObj, typeProduce: true}).fetch();
	}
});