const validator = require("validator");

// Based on the following instructions:
// https://isbn-information.com/convert-isbn-10-to-isbn-13.html

module.exports = {
  convert(isbn) {
    if (validator.isISBN(isbn, 10)) {
      // 1 - Drop the last digit
      isbn = isbn.slice(0, -1);

      // 2 - Prepend digits "978"
      isbn = "978" + isbn;

      // 3 - Calculate weights for the check digit
      let multipliers = [1, 3];
      let weights = [];

      for (let i = 0; i < isbn.length; i++) {
        weights.push(parseInt(isbn[i]) * multipliers[i % 2]);
      }

      // 4 - Add weights from step 3
      const sum = weights.reduce((prev, curr) => prev + curr);

      // 5 - Perform a modulo 10 on the accumulated weight from step 4
      const remainder = sum % 10;

      // 6 - Generate check digit
      const check = remainder === 0 ? 0 : 10 - remainder;

      // 7 - Append check digit
      isbn += check;

      return isbn;
    } else {
      return {
        status: "error",
        message: "O código ISBN informado não respeita o padrão ISBN 10",
      };
    }
  },
};
