
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cors from 'cors';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(cors({
  origin: [
    'https://www.enricozammitlonardelli.com',
    'https://www.ezl.me'
  ]
}));

main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/warmup', (request, response) => {

    response.send('Warming up friend.');

})

app.get('/modules/:id', async (request, response) => {
  try {
    const moduleId = request.params.id;

    if (!moduleId) throw new Error('Module id required');

    const module = await db.collection('modules').doc(moduleId).get();

    if (!module.exists){
        throw new Error('Module doesnt exist.')
    }

    response.json({
      id: module.id,
      data: module.data()
    });

  } catch(error){

    response.status(500).send(error);

  }

});


app.get('/modules', async (request, response) => {
  try {

    const moduleQuerySnapshot = await db.collection('modules').get();
    const modules = [];
    moduleQuerySnapshot.forEach(
        (doc) => {
            modules.push({
                id: doc.id
            });
        }
    );

    response.json(modules);

  } catch(error){

    response.status(500).send(error);

  }

});


