import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class OrderListPendingController {
  async index(req, res) {
    const { page = 1 } = req.query;

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
      order: [['id', 'ASC']],
      limit: 5,
      offset: (page - 1) * 5,
    });

    if (orders.count === 0) {
      return res.json({ error: 'You have no pending orders' });
    }

    return res.json(orders);
  }
}

export default new OrderListPendingController();
