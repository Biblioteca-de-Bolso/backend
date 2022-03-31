const dayjs = require("dayjs");

module.exports = {
  async date(req, res, next) {
    try {
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

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
