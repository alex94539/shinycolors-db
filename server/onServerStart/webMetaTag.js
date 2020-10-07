import { onPageLoad } from 'meteor/server-render';
import { Base64 } from 'js-base64';

import { bigPic } from '../../db/db.js';

onPageLoad((sink) => {
    console.log(sink.request.url.pathname, sink.request.headers['x-forwarded-for']);
    const pathName = sink.request.url.pathname;
    
    sink.appendToHead(`<link rel="icon" sizes="48x48" href="/favicon.ico?v=2">\n`);

    if(pathName.match(/PCardDetail/)){
        const cardName = Base64.decode(pathName.split('/')[2]);
        const picReg = new RegExp(cardName.replace('【', '').replace('】', ' ') + `+.png`);
        const cardPic = bigPic.findOne({cardName: picReg});
        sink.appendToHead(`<meta charset="utf-8" />`);
        sink.appendToHead(createMetaTag('og:title', cardName));
        sink.appendToHead(createMetaTag('og:url', `https://shinycolors.moe${pathName}`));
        sink.appendToHead(createMetaTag('og:image', `https://shinycolors.moe/bigPic/${cardPic.uuid}`));
        sink.appendToHead(createMetaTag('og:image:url', `https://shinycolors.moe/bigPic/${cardPic.uuid}`));
        sink.appendToHead(createMetaTag('og:site_name', `shinycolors-db`));
        sink.appendToHead(createMetaTag('og:description', cardName));
        sink.appendToHead(createMetaTag('og:type', 'website'));
    }
    if(pathName.match(/SCardDetail/)){

    }
});

function createMetaTag(property, content){
    return `<meta property="${property}" content="${content}" />\n`;
}