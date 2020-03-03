import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class OrderListPendingController {
  async index(req, res) {
    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findOne({
      where: { id, deleted_at: null },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const orders = await Order.findAndCountAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
    });

    if (orders.count === 0) {
      return res.json({ error: 'You have no pending orders' });
    }

    return res.json(orders);
  }
}

export default new OrderListPendingController();
