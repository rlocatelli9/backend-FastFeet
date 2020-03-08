import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Order';

class OrderListDoneController {
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
        end_date: {
          [Op.ne]: null, // WHERE end_date NOT NULL;
        },
      },
      order: [['id', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    if (orders.count === 0) {
      return res.json({ error: 'You have no closed orders' });
    }

    return res.json(orders);
  }
}

export default new OrderListDoneController();
