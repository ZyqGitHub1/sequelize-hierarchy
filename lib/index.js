/* eslint-disable func-names */
/* --------------------
 * Sequelize hierarchy
 * Entry point
 * ------------------*/

// Modules
const _ = require('lodash');

// Imports
const patchesFn = require('./patches');
const modelExtendsFn = require('./modelExtends');
const hooksUniversalFn = require('./hooksUniversal');
const errors = require('./errors');

// Exports

module.exports = function (Sequelize) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  if (!Sequelize) Sequelize = require('sequelize');

  // Add custom errors to Sequelize
  errors(Sequelize);

  // Extend Model
  const patches = patchesFn(Sequelize);
  const modelExtends = modelExtendsFn(Sequelize, patches);
  Object.assign(patches.modelConstructor, modelExtends);

  // Add hook on Sequelize() to create universal hooks
  const hooksUniversal = hooksUniversalFn(Sequelize, patches);
  Sequelize.addHook('afterInit', (sequelize) => {
    // Apply hooks
    _.forIn(hooksUniversal, (hookFn, hookName) => {
      sequelize.addHook(hookName, hookFn);
    });
  });

  // Return Sequelize
  return Sequelize;
};
