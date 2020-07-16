import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { idols, units, idolDetail, idolCards, idolCardsDetail, bigPic} from '../db/db.js';



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
        return bigPic.find({cardName: reg}, {$sort: {cardName: 1}}).fetch();
	},
	
	//PCardSingle
	getPCardSingleDetail({cardName}) {
		return idolCardsDetail.find({cardName: cardName, type: /P/}).fetch();
	},

	//SCardSingle
	getSCardSingleDetail({cardName}) {
		return idolCardsDetail.find({cardName: cardName, type: /S/}).fetch();
	},
});