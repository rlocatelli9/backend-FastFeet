import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import RegisterMail from '../jobs/RegisterMail';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
// import Notification from '../schemas/Notification';

class OrderController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: { canceled_at: null },
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman || deliveryman.deleted_at !== null) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient || recipient.deleted_at !== null) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const { id, product } = await Order.create(req.body);

    /*  await Notification.create({
      content: `Uma nova encomenda foi cadastrada em seu nome e já está disponível para retirada.`,
      user: deliveryman_id,
    }); */

    await Queue.add(RegisterMail.key, {
      deliveryman,
      recipient,
      product,
    });

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id, {
      where: { canceled_at: null, end_date: null },
      include: [
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
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    if (recipient_id && recipient_id !== order.recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id, {
        where: { deleted_at: null },
      });
      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exists' });
      }
    }

    if (deliveryman_id && deliveryman_id !== order.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id, {
        where: { deleted_at: null },
      });
      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman does not exists' });
      }
    }

    const orderUpdated = await order.update(
      recipient_id,
      deliveryman_id,
      product
    );

    return res.json(orderUpdated);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id, {
      where: { canceled_at: null },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({
        error: 'Order does not exists or has already been canceled.',
      });
    }

    if (order.start_date !== null && order.end_date === null) {
      return res.status(401).json({
        error:
          'To cancel the Order that are already on your way, so please inform us if you have any problem.',
      });
    }

    order.canceled_at = new Date();

    await order.save();

    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }
}

export default new OrderController();
