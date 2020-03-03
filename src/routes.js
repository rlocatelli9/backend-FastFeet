import { Router } from 'express';
import multer from 'multer';
import CloseDeliveryController from './app/controllers/CloseDeliveryController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import NotificationControle from './app/controllers/NotificationController';
import OrderController from './app/controllers/OrderController';
import OrderListDoneController from './app/controllers/OrderListDoneController';
import OrderListPendingController from './app/controllers/OrderListPendingController';
import PickUpPackageController from './app/controllers/PickUpPackageController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/deliveryman/:id/notifications', NotificationControle.index); // temp

routes.put('/orders/:id/start/:idDeliveryman', PickUpPackageController.update);
routes.put('/orders/:id/end/:idDeliveryman', CloseDeliveryController.update);
routes.get(
  '/deliveryman/:id/deliveries/pending',
  OrderListPendingController.index
);
routes.get('/deliveryman/:id/deliveries/done', OrderListDoneController.index);

routes.use(authMiddleware);

routes.get('/deliverers', DeliverymanController.index);
routes.get('/orders', OrderController.index);

routes.post('/recipients', RecipientController.store);
routes.post('/deliverers', DeliverymanController.store);
routes.post('/orders', OrderController.store);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/users', UserController.update);
routes.put('/deliverers/:id', DeliverymanController.update);
routes.put('/orders/:id', OrderController.update);

routes.delete('/recipients/:id', RecipientController.delete);
routes.delete('/deliverers/:id', DeliverymanController.delete);
routes.delete('/problem/:id/cancel-delivery', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
