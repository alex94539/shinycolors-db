import { onPageLoad } from 'meteor/server-render';
import { Base64 } from 'js-base64';

import { bigPic } from '../../db/db.js';

onPageLoad((sink) => {
    console.log(sink.request.url.pathname);
    const pathName = sink.request.url.pathname;
    if(pathName.match(/PCardDetail/)){
        const cardName = Base64.decode(pathName.split('/')[2]);
        const picReg = new RegExp(cardName.replace('【', '').replace('】', ' ') + `+.png`);
        const cardPic = bigPic.findOne({cardName: picReg});
        sink.appendToHead(`<meta charset="utf-8" />`);
        sink.appendToHead(createMetaTag('og:title', cardName));
        sink.appendToHead(createMetaTag('og:url', `https://shinycolors.nctu.me${pathName}`));
        sink.appendToHead(createMetaTag('og:image', `https://shinycolors.nctu.me/bigPic/${cardPic.uuid}`));
        sink.appendToHead(createMetaTag('og:image:url', `https://shinycolors.nctu.me/bigPic/${cardPic.uuid}`));
        sink.appendToHead(createMetaTag('og:site_name', `shinycolors-db`));
        sink.appendToHead(createMetaTag('og:description', cardName));

    }
    if(pathName.match(/SCardDetail/)){

    }
});

function createMetaTag(property, content){
    return `<meta property="${property}" content="${content}" />`;
}