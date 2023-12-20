import * as fs from 'fs';
import { parse } from 'csv-parse';
import fetch from "node-fetch";

export async function csvReader() {

  fs.createReadStream('./tasks.csv')
    .pipe(parse({delimiter: ',', from_line: 2}))
    .on('data', async function(csvrow) {
        console.log(csvrow);
        const url = "http://localhost:3333/tasks"
        const config = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({'title': csvrow[0], 'description': csvrow[1]})
      };

      const response = await fetch(url, config)
      console.log('response -> ', response);
    })
    .on('end',function() {
      console.log('finished readeing csv');
    });
}

await csvReader();