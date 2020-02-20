import Mail from '../../lib/Mail';

class RegisterMail {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova encomenda cadastrada',
      template: 'register',
      context: {
        deliveryman: deliveryman.name,
        product,
        client: recipient.name,
        street: recipient.street,
        number: recipient.number,
        city: recipient.city,
        nation: recipient.state,
        zip_code: recipient.zip_code,
      },
    });
  }
}

export default new RegisterMail();
