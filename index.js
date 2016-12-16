const pg = require('pg-rxjs')
const fs = require('fs');
const xml2js = require('xml2js');
const Rx = require('rx');

// Default config: { debug: false, noMoment: false }
// 'debug' option console.logs statements that pg will execute
const pool = pg.Pool('postgres://@localhost/audioanki', {});

//convert xml manifest to json and pipe it to new file
/*var parser = new xml2js.Parser();
fs.readFile( 'flac/index.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.log(JSON.stringify(result));
        //console.dir(result.index.group[0].file);
        //console.log('Done');
    });
});*/

//save the json manifest to the table
/*const manifestoJson = require('./output.json');
var rows = manifestoJson.index.group[0].file;
//console.log(insertObj);

Rx.Observable.fromArray(rows)
    .map((thisRow) => {
        console.log(thisRow.$.path);
        return {
            recievedname: thisRow.$.path, baseform: thisRow.tag[0].$.swac_baseform, alphaidx: thisRow.tag[0].$.swac_alphaidx,
            formname: thisRow.tag[0].$.swac_form_name, textname: thisRow.tag[0].$.swac_text
        }
    }).flatMapWithMaxConcurrent(5, (() => {
        var idInc = 1;
        return (rowObj) => {
            console.log(rowObj.textName);
            return pool.query('INSERT INTO langData (id, recievedname, baseform, alphaidx, formname, textname) VALUES ' +
                "(" + idInc++ + ", '" + rowObj.recievedname + "','" + rowObj.baseform + "','" +
                rowObj.alphaidx + "','" + rowObj.formname + "','" + rowObj.textname + "')");

        }
    })())
    .subscribe((insertResp) => {
        console.log(insertResp);
    }, (errObj) => {
        console.log('error stuffs');
        console.log(errObj);
    });*/

function phraseToFileName(phraseName) {
    return phraseName.toLowerCase().split(" ").join("-");
}

pool
    .stream('SELECT recievedname, textname FROM langData;')

    .flatMapWithMaxConcurrent(5, (dbRecord) => {
        return Rx.Observable.of(dbRecord);
    })
    .subscribe(dbRecord => {
        console.log(dbRecord);
        fs.rename('flac/' + dbRecord.recievedname, 'renamed_flac/' + phraseToFileName(dbRecord.textname) + '.flac', function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    }, err => {}, end => {});


/*
*/