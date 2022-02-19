const dayjs = require("dayjs");

const iat = dayjs().valueOf();
const exp = dayjs(iat).add(10, "minute").valueOf();

const iatString = dayjs(iat, "X").format("");
const expString = dayjs(exp, "X").format("");

console.log("IAT:", iatString);
console.log("EXP:", expString);