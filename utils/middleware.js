const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.log("Method: ", req.method);
  logger.log("Path:   ", req.path);
  logger.log("Body:   ", req.body);
  logger.log("--- ");
  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
};
