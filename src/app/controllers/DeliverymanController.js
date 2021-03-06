import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1, isLike } = req.query;
    const deliverers = await Deliveryman.findAll({
      where: {
        deleted_at: null,
        name: {
          [Op.iLike]: `%${isLike}%`,
        },
      },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: [['id', 'ASC']],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name, email } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { email } = req.body;

    if (email) {
      const emailExists = await Deliveryman.findOne({
        where: { email },
      });

      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const { name, avatar_id } = await deliverymanExists.update(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    /*     const recipientExists = await Recipient.destroy({
      where: { id },
    }); */

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    deliveryman.deleted_at = new Date();

    await deliveryman.save();

    return res.status(200).json(deliveryman);
  }
}

export default new DeliverymanController();
