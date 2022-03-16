// Express.js Custom Error Handler
module.exports = (err, req, res, next) => {
  let file = "";

  if (err.stack.includes("/")) {
    // Unix Based Systemas
    file = err.stack.split("\n")[1].split("/").pop().replace(")", "");
  } else {
    // Windows Based Systems
    file = err.stack.split("\n")[1].split("\\").pop().replace(")", "");
  }

  console.log(file, "-", err.name, "-", err.message);

  return res.status(500).json({
    code: "InternalServerError",
    message: `${err.name}: ${err.message}`,
    file: file,
  });
};
