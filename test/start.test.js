const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

mocha.it('should add number correctly', () => {
  const num1 = 2;
  const num2 = 3;
  expect(num1 + num2).to.equal(5);
});
