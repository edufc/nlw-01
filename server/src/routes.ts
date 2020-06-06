import express from 'express';
import ItemsController from './controllers/itemsController';
import PointsControllers from './controllers/pointsController';

const routes = express.Router();
const pointsControllers = new PointsControllers();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.post('/points', pointsControllers.create);
routes.get('/points', pointsControllers.index);
routes.get('/points/:id', pointsControllers.show);

export default routes;