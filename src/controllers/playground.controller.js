const dayjs = require("dayjs");

module.exports = {
  async date(req, res, next) {
    try {
      a++;

      const iat = dayjs().valueOf();
      const exp = dayjs(iat).add(10, "minute").valueOf();

      const iatString = dayjs(iat, "X").format("");
      const expString = dayjs(exp, "X").format("");

      const response = {
        IAT: iat,
        EXP: exp,
        "IAT Format": iatString,
        "EXP Format": expString,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
