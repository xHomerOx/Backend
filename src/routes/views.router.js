import { Router } from 'express';
import { join } from 'path';
import fs from 'fs';
import __dirname from '../utils.js';

const viewsRouter = Router();
let myIndex;

viewsRouter.get('/', (_req, res) => {
  res.render('realTimeProducts');
});

//Exporto ambos ya que tengo el Index en public.
export default viewsRouter;
