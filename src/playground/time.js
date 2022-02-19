const dayjs = require("dayjs");

const iat = dayjs().valueOf();
const exp = dayjs(iat).add(10, "minute").valueOf();

const iatDate = dayjs(iat, "x").format("");
const expDate = dayjs(exp, "x").format("");

const iatString = iat.toString().slice(0, 10);
const expString = iat.toString().slice(0, 10);

console.log("IAT (ms):", iat);
console.log("EXP (ms):", exp);
console.log("IAT (s) :", iatString);
console.log("EXP (s) :", expString);
console.log("IAT (date):", iatDate);
console.log("EXP (date):", expDate);
