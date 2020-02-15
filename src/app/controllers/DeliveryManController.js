import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name, email } = await DeliveryMan.create(req.body);

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

    const recipientExists = await DeliveryMan.findByPk(id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await recipientExists.update(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }

  async destroy(req, res) {
    const { id } = req.params;

    /*     const recipientExists = await Recipient.destroy({
      where: { id },
    }); */

    const recipient = await DeliveryMan.findByPk(id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    recipient.deleted_at = new Date();

    await recipient.save();

    return res.sendStatus(recipient);
  }
}

export default new DeliveryManController();
