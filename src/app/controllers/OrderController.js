import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import RegisterMail from '../jobs/RegisterMail';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

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

    /* await Notification.create({
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

    return res.json();
  }
}

export default new OrderController();
