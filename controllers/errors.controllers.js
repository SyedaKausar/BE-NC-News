exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    console.log(err);
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handlePSQLerrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
};
exports.handleInternalServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("internal Server error");
};
