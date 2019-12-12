import amqp from 'amqplib/callback_api';

class Publisher {
  private channel;
  private logger;
  private creationPromise;

  constructor(amqpUri: string, logger?) {
    this.logger = logger || { info: console.log, debug: console.log, error: console.error };
    this.creationPromise = new Promise((resolve, reject) => {
      amqp.connect(amqpUri, (error0, connection) => {
        if (error0) {
          this.logger.error('Error while connecting to RabbitMQ', error0);
          return reject(error0);
        }

        connection.createChannel((error1, channel) => {
          if (error1) {
            this.logger.error('Error while creating RabbitMQ channel', error1);
            return reject(error1);
          }

          this.channel = channel;

          resolve();
        });
      });
    });
  }

  public async createQueue(queue, options) {
    try {
      await this.creationPromise;

      this.channel.assertQueue(queue, Object.assign({ 
        durable: true
      }, options));
    } catch (err) {
      this.logger.error('Error while creating RabbiMQ queue', err);
      return err;
    } 
  }

  public sendToQueue(queue, msg) {
    this.channel.sendToQueue(queue, Buffer.from(msg));
    this.logger.info("[x] Sent %s", msg);
  }
}

const AMQP_URI = process.env.AMQP_URI || 'amqp://localhost:5672';

export default new Publisher(AMQP_URI);
