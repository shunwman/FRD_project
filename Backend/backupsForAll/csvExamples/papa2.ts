// import Papa from 'papaparse';/
const Papa = require('papaparse')
import fs from 'fs';
import path from 'path';

(async () => {
    let data = fs.readFileSync(path.join(__dirname, "dummyCsv.csv"), { encoding: 'utf-8' });
    let { data: csvObj } = await Papa.parse(data, { header: true, delimiter: '||' })

    csvObj = csvObj.map((row: any) => {

        console.log(row.jsonB)
        console.log(JSON.parse(row.jsonB)["steps"])
        return {
            ...row,
            jsonB: row.jsonB ? JSON.parse(row.jsonB) : {}
        }
    })

    // console.log(csvObj)


})()


