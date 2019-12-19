import amqp from 'amqplib/callback_api';

class Publisher {
  private channel;
  private logger;
  private creationPromise;

  constructor(amqpUri: string, logger?) {
    this.logger = logger || { info: console.log, debug: console.log, error: console.error };

    this.initialize(amqpUri);
  }

  public setLogger(logger) {
    this.logger = logger;
  }

  public async createQueue(queue, options) {
    try {
      await this.creationPromise;

      this.channel.assertQueue(queue, Object.assign({ 
        durable: true
      }, options));
    } catch (err) {
      this.logger.error('Error while creating RabbitMQ queue', err);
      return err;
    } 
  }

  public sendToQueue(queue, msg) {
    this.channel.sendToQueue(queue, Buffer.from(msg));
    this.logger.info("[x] Sent %s", msg);
  }

  private async initialize(amqpUri) {
    this.logger.info(`Connecting to RabbitMQ at ${amqpUri}...`);

    return this.setUpRabbitMQ(amqpUri)
      .then(() => this.logger.info('RabbitMQ connected'))
      .catch(() => {
        this.logger.info('Trying to reconnect to RabbitMQ in 1000ms...');

        setTimeout(() => this.initialize(amqpUri), 1000);
      });
  }

  private async setUpRabbitMQ(amqpUri) {
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

    return this.creationPromise;
  }
}

const AMQP_URI = process.env.AMQP_URI || 'amqp://0.0.0.0:5672';

export default new Publisher(AMQP_URI);
