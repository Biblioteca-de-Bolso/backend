// Based on the following instructions:
// https://isbn-information.com/convert-isbn-10-to-isbn-13.html
// https://www.quora.com/How-do-you-convert-a-13-digit-ISBN-to-a-10-digit-ISBN

// Those functions assume that the ISBN in the input is already validate as an ISBN 13 or 10.
// For validation, I recommend the following package: validator.js

// isbn10to13(isbn) -> Convert an ISBN 10 to ISBN 13
// isbn13to10(isbn) -> Convert an ISBN 13 to ISBN 10

module.exports = {
  isbn10to13(isbn) {
    // 1 - Drop the last digit
    isbn = isbn.slice(0, -1);

    // 2 - Prepend digits "978"
    isbn = "978" + isbn;

    // 3 - Calculate weights for the check digit
    let multipliers = [1, 3];
    let weights = [];

    for (let i = 0; i < isbn.length; i++) {
      weights.push(parseInt(isbn[i]) * multipliers[i % 2], 10);
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
  },

  isbn13to10(isbn) {
    // 1 - Remove the first three digits
    isbn = isbn.substring(3);

    // 2 - Remove the last digit
    isbn = isbn.slice(0, -1);

    // 3 - Calculate the weights for the check digit
    let multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
    let weights = [];

    for (let i = 0; i < isbn.length; i++) {
      weights.push(parseInt(isbn[i], 10) * multipliers[i]);
    }

    // 4 - Add weights from step 3
    const sum = weights.reduce((prev, curr) => prev + curr);

    // 5 - Perfom a modulo 11 on the accumulated weight form step 4
    const remainder = sum % 11;

    // 6 - Generate check digit
    let check = remainder === 0 ? 0 : 11 - remainder;

    // 7 - Verify if the check digit is valid
    check = check === 10 ? "X" : check;

    // 8 - Append check digit
    isbn += check;

    return isbn;
  },
};
