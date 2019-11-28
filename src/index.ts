import fastifyApp from './App';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT) || 8080;

try {
  fastifyApp.listen(PORT, HOST);
} catch (error) {
  fastifyApp.log.error(error);
}
