const chai = require('chai');
require('jest-extended');

const utils = require('./utils');

chai.should();

// global.jestExpect = global.expect;
// global.expect = chai.expect;
global.utils = utils;