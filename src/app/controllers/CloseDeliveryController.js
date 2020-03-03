import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Order';

class CloseDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, idDeliveryman } = req.params;
    const order = await Order.findOne({
      where: { id, end_date: null, canceled_at: null },
      include: [
        { model: File, as: 'signature', attributes: ['path', 'url'] },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    if (order.start_date === null) {
      return res
        .status(400)
        .json({ error: 'The order should be withdrawn to be completed ' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: idDeliveryman, deleted_at: null },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }
    const parsedDeliveryId = Number(idDeliveryman);
    if (order.deliveryman_id !== parsedDeliveryId) {
      return res
        .status(401)
        .json({ error: 'This order is not from this deliveryman' });
    }

    const { signature_id } = req.body;

    const orderClosed = await order.update({
      signature_id,
      end_date: new Date(),
    });

    return res.json(orderClosed);
  }
}

export default new CloseDeliveryController();
