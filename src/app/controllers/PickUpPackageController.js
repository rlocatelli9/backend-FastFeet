import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class PickUpPackageController {
  async update(req, res) {
    const { id, idDeliveryman } = req.params;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order does not exists' });
    }

    if (!(order.deliveryman_id !== idDeliveryman)) {
      return res
        .status(401)
        .json({ error: 'This order is not from this deliveryman' });
    }

    if (order.start_date !== null) {
      return res.status(401).json({
        error: 'The order has already been started',
      });
    }
    if (order.canceled_at !== null) {
      return res.status(401).json({
        error: 'You cannot start a delivery because it has been canceled.',
      });
    }

    const parsedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx");

    const date = parseISO(parsedDate);

    const hourStart = setSeconds(setMinutes(setHours(date, 8), 0), 0);
    const hourEnd = setSeconds(setMinutes(setHours(date, 18), 0), 0);

    const parsedHourStart = parseISO(
      format(hourStart, "yyyy-MM-dd'T'HH:mm:ssxxx")
    );
    const parsedHourEnd = parseISO(format(hourEnd, "yyyy-MM-dd'T'HH:mm:ssxxx"));

    console.log(parsedDate);
    console.log(parsedHourStart);

    if (
      !(
        isBefore(parsedHourStart, new Date()) &&
        isAfter(parsedHourEnd, new Date())
      )
    ) {
      return res
        .status(401)
        .json({ error: 'Orders can only be picked up between 8AM and 6PM.' });
    }

    const totalPickUp = await Order.findAndCountAll({
      where: {
        deliveryman_id: idDeliveryman,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (totalPickUp.count >= 5) {
      return res.status(401).json({
        error: 'You have already reached the limit of 5 withdrawals per day.',
      });
    }

    const started = await order.update({
      start_date: parsedDate,
    });

    return res.json(started);
  }
}
export default new PickUpPackageController();
