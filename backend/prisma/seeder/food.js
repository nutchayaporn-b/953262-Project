const appetizers = require('./food/appetizer');
const mainCourses = require('./food/main-course');
const desserts = require('./food/dessert');
const beverages = require('./food/beverage');
const foods = [...appetizers, ...mainCourses, ...desserts, ...beverages];

module.exports = foods;
