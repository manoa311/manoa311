import { filter } from 'underscore';
/* global _ */
console.log('Hello World, I\'m javascript.');

const words = ['school', 'cry', 'google', 'fly'];

function has(chr) {
  return function (word) {
    return _.contains(word, chr);
  };
}

const functionsArray = [has('o'), has('f')];
const output = _.filter(words, function (word) {
  return _.some(functionsArray, function (currentFunction) {
    return currentFunction(word);
  });
});

console.log(output);
