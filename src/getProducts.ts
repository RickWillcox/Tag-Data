import { LureProduct, MediaAsset } from '@lureapps/mongo-models';
import mongoose from 'mongoose';
const fs = require('fs');
const ProgressBar = require('progress');

var lureJson: Object = {};

async function getProducts() {
    await mongoose.connect('mongodb://localhost/local', {});
    const db = mongoose.connection;
    const cursor = db.collection('lureproducts').find({});

    const DOCS_TO_DOWNLOAD: number = 30000;
    var bar = new ProgressBar(
        '  downloading [:bar] :current/:total :percent :etas',
        {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: DOCS_TO_DOWNLOAD,
        }
    );

    for (let i = 0; i < DOCS_TO_DOWNLOAD; i++) {
        const doc = await cursor.next();
        var lureProduct = await LureProduct.findById(doc._id);
        lureJson[lureProduct['id']] = lureProduct;
        bar.tick();
    }

    fs.writeFile(
        'raw_lure_products.json',
        JSON.stringify(lureJson),
        function (err: any) {
            if (!err) {
                console.log('raw_lure_products.json Saved!');
            }
        }
    );
}

getProducts();
