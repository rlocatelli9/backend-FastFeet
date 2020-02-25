import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`, // list of receivers
      subject: 'Entrega Cancelada', // Subject line
      template: 'cancellation',
      context: {
        deliveryman: order.deliveryman.name,
        id: order.id,
        recipient: order.recipient.name,
        date: format(
          parseISO(order.canceled_at),
          "dd 'de' MMMM', às ' HH:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
