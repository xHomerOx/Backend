import { Router } from 'express';
import { join } from 'path';

const viewsRouter = Router();
let myIndex;

viewsRouter.get('/realtimeproducts', (_req, res) => {
  const fs = require('fs');
  myIndex = fs.readFileSync(join(__dirname, '../public/index.js'), 'utf8');

  res.render('realTimeProducts', { myIndex });
});

//Exporto ambos ya que tengo el Index en public.
export { viewsRouter, myIndex } ;
