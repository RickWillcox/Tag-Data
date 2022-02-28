import { WomanWords, ManWords, KidWords, TopLevel } from './categories';

const fs = require('fs');

let rawdata = fs.readFileSync('raw_lure_products.json');
let allLureProducts = JSON.parse(rawdata);
console.log(Object.keys(allLureProducts).length);

// categories go here
let jsonCategories: Object = {};

let jsonWordFreq: Object = {};

const matches = (str, regex) => {
    return ((str || '').match(regex) || []).length;
};

var count = 0;
for (let product in allLureProducts) {
    if (count >= 30000) break;
    count += 1;
    console.log(allLureProducts[product]);
    let strProduct = JSON.stringify(allLureProducts[product]);
    jsonWordFreq[product] = {};
    const topLevelList = [ManWords, WomanWords, KidWords];
    for (let topLevel of TopLevel) {
        let topLevelRe: string = '';
        let groupList: string[];
        if (topLevel === 'mens') {
            groupList = topLevelList[0];
        } else if (topLevel === 'womens') {
            groupList = topLevelList[1];
        } else {
            groupList = topLevelList[2];
        }
        // console.log(topLevel, groupList);
        groupList.forEach((word) => {
            const re = /word/g;
            let match = matches(strProduct, re);
            // `Product: ${product} | topLevel: ${topLevel} | Word: ${word} | jsprtl: ${jsonWordFreq[product][topLevel]}`
            jsonWordFreq[product][topLevel] =
                jsonWordFreq[product][topLevel] === undefined
                    ? 0
                    : jsonWordFreq[product][topLevel] + match;
        });
    }
}

// for (let uuid in jsonWordFreq) {
//     let allZero = true;
//     for (let cat in jsonWordFreq[uuid]) {
//         if (jsonWordFreq[uuid][cat] !== 0) {
//             allZero = false;
//         }
//     }
//     if (allZero) {
//         delete jsonWordFreq[uuid];
//     }
// }

console.table(jsonWordFreq);
console.table(Object.keys(jsonWordFreq).length);

// for (let product in allLureProducts) {
//     let strProduct = JSON.stringify(allLureProducts[product]);

//     for (let topLevel in jsonCategories){
//         let topLevelRe = `/${topLevel}/g`
//         jsonWordFreq[product][topLevel][matches] = matches(strProduct, topLevelRe)

//         // man woman kids

//         for (let secondLevel in jsonCategories[topLevel]){
//             let secondLevelRe = `/${jsonCategories[topLevel][secondLevel]}/g`
//             jsonWordFreq[product][topLevel][secondLevel] = matches(strProduct, secondLevelRe)
//         }
//         for (let thirdLevel in jsonCategories[topLevel][secondLevel]){
//             let thirdLevelRe = `/${jsonCategories[topLevel][secondLevel][thirdLevel]}/g`
//             jsonWordFreq[product][topLevel][secondLevel][thirdLevel] = matches(strProduct, thirdLevelRe)
//         }

//     }
// }
