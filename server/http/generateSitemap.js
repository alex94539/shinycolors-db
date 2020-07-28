import { WebApp } from 'meteor/webapp';
import { Meteor } from 'meteor/meteor';
import { Base64 } from 'js-base64';

import { idolCardsDetail } from '../../db/db.js';

WebApp.connectHandlers.use('/sitemap.xml', (req, res, next) => {
    let xmlData = `<?xml version="1.0" encoding="UTF-8"?>`;
    xmlData += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    idolCardsDetail.find({}).forEach(element => {
        xmlData += createCardURLTag(element);
    });

    xmlData += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    res.end(xmlData);
});

function createCardURLTag(element){
    return `<url>
                <loc>${createLocTag(element)}</loc>
                <priority>0.5</priority>
            </url>`;
}

function createLocTag(element){
    let locData = 'https://shinycolors.nctu.me/';
    if(element.type.match(/P_/)){
        locData += 'PCardDetail/';
    }
    else if(element.type.match(/S_/)){
        locData += 'SCardDetail/';
    }
    locData += Base64.encodeURI(element.cardName);

    return locData;
}