import * as Yup from 'yup';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveryProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const problems = await DeliveryProblems.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!problems) {
      return res.status(400).json({ error: 'None delivery problems found' });
    }

    return res.json(problems);
  }

  async show(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const problem = await DeliveryProblems.findAll({
      where: {
        delivery_id: id,
      },
      attributes: ['id', 'description'],
      order: [['id', 'DESC']],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!problem) {
      return res.status(400).json({ error: 'None problem found' });
    }

    return res.json(problem);
  }

  async store(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { description } = req.body;

    const order = await Order.findOne({
      where: { id, canceled_at: null },
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    const deliveryProblems = await DeliveryProblems.create({
      delivery_id: id,
      description,
    });

    return res.json(deliveryProblems);
  }

  async delete(req, res) {
    const { id } = req.params;
    const order_problem = await DeliveryProblems.findByPk(id);

    if (!order_problem) {
      return res.status(401).json({ error: 'Order problem not found' });
    }

    const { delivery_id } = order_problem;

    const order = await Order.findOne({
      where: { id: delivery_id, canceled_at: null },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!order) {
      return res
        .status(401)
        .json({ error: 'Order does not exists or is already canceled' });
    }

    order.canceled_at = new Date();

    await Queue.add(CancellationMail.key, {
      order,
      order_problem,
    });

    await order.save();

    return res.json(order);
  }
}

export default new DeliveryProblemsController();
