const config = require('./config');
const userRepository = require('./repositories/userRepository');
const paymentRepository = require('./repositories/paymentRepository');
const mastercardClient = require('./integrations/mastercard/client');
const mastercardGateway = require('./integrations/mastercard/operations');
const userService = require('./services/userService');
const paymentService = require('./services/paymentService');
const userOperations = require('./operations/userOperations');
const paymentOperations = require('./operations/paymentOperations');
const userController = require('./controllers/userController');
const paymentController = require('./controllers/paymentController');

const createContainer = () => {
  const repos = {
    userRepository: userRepository(),
    paymentRepository: paymentRepository()
  };
  const gateways = {
    mastercardClient: mastercardClient(config)
  };
  const services = {
    userService: userService(repos.userRepository),
    paymentService: paymentService(
      repos.paymentRepository,
      repos.userRepository,
      mastercardGateway(gateways.mastercardClient)
    )
  };
  const operations = {
    userOperations: userOperations(services.userService),
    paymentOperations: paymentOperations(services.paymentService)
  };
  return {
    userController: userController(operations.userOperations),
    paymentController: paymentController(operations.paymentOperations)
  };
};

module.exports = createContainer;
