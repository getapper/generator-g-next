"use strict";

/**
 * yeoman-generator v7+ is ESM-only. Loading it from CommonJS needs Node’s
 * `require()` of native ESM (Node ^20.17 || >=22.9 — see package.json "engines").
 * The resolved namespace uses `default` as the Base class.
 */
const ns = require("yeoman-generator");

module.exports = ns.default ?? ns;
