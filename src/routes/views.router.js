import { Router } from 'express';
import { join } from 'path';
import fs from 'fs';
import __dirname from '../utils.js';

const viewsRouter = Router();
let myIndex;

viewsRouter.get('/', (_req, res) => {
  myIndex = fs.readFileSync(join(__dirname, '/public/js/index.js'), 'utf8');

  res.render('realTimeProducts', { myIndex });
});

//Exporto ambos ya que tengo el Index en public.
export { viewsRouter, myIndex } ;
