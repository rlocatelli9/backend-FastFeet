import { Router } from 'express';
import multer from 'multer';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/deliverers', DeliverymanController.index);
routes.get('/orders', OrderController.index);

routes.post('/recipients', RecipientController.store);
routes.post('/deliverers', DeliverymanController.store);
routes.post('/orders', OrderController.store);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/users', UserController.update);
routes.put('/deliverers/:id', DeliverymanController.update);

routes.delete('/recipients/:id', RecipientController.destroy);
routes.delete('/deliverers/:id', DeliverymanController.destroy);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
