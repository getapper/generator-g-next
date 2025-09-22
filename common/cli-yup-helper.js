"use strict";
const yup = require("yup");
const chalk = require("chalk");
const yosay = require("yosay");
const { getGenygConfigFile, getSpas } = require("./index");

/**
 * Helper function to create CLI arguments and options for Yeoman generators
 * @param {Object} config - Configuration object for the generator
 * @param {Array} config.arguments - Array of argument definitions
 * @param {Array} config.options - Array of option definitions
 * @returns {Function} Constructor function to be called in generator constructor
 */
const createCliConfig = (config) => {
  return function(args, opts) {
    const Generator = require("yeoman-generator");
    Generator.apply(this, [args, opts]);

    // Add arguments
    if (config.arguments) {
      config.arguments.forEach(arg => {
        this.argument(arg.name, arg.config);
      });
    }

    // Add options
    if (config.options) {
      config.options.forEach(option => {
        this.option(option.name, option.config);
      });
    }
  };
};

/**
 * Helper function to create Yup validation schema
 * @param {Object} schemaConfig - Schema configuration
 * @returns {Object} Yup schema object
 */
const createValidationSchema = (schemaConfig) => {
  const schema = {};
  
  Object.keys(schemaConfig).forEach(field => {
    const fieldConfig = schemaConfig[field];
    let fieldSchema = yup.string();
    
    // Apply validations based on configuration
    if (fieldConfig.required) {
      fieldSchema = fieldSchema.required(fieldConfig.requiredMessage || `${field} is required`);
    }
    
    if (fieldConfig.minLength) {
      fieldSchema = fieldSchema.min(fieldConfig.minLength, fieldConfig.minLengthMessage || `${field} must be at least ${fieldConfig.minLength} characters`);
    }
    
    if (fieldConfig.maxLength) {
      fieldSchema = fieldSchema.max(fieldConfig.maxLength, fieldConfig.maxLengthMessage || `${field} must be at most ${fieldConfig.maxLength} characters`);
    }
    
    if (fieldConfig.pattern) {
      fieldSchema = fieldSchema.matches(fieldConfig.pattern, fieldConfig.patternMessage || `${field} format is invalid`);
    }
    
    if (fieldConfig.oneOf) {
      fieldSchema = fieldSchema.oneOf(fieldConfig.oneOf, fieldConfig.oneOfMessage || `${field} must be one of: ${fieldConfig.oneOf.join(', ')}`);
    }
    
    if (fieldConfig.customValidation) {
      fieldSchema = fieldSchema.test(fieldConfig.customValidation.name, fieldConfig.customValidation.message, fieldConfig.customValidation.test);
    }
    
    if (fieldConfig.conditional) {
      fieldSchema = fieldSchema.when(fieldConfig.conditional.field, {
        is: fieldConfig.conditional.value,
        then: fieldConfig.conditional.then,
        otherwise: fieldConfig.conditional.otherwise
      });
    }
    
    if (fieldConfig.type === 'boolean') {
      fieldSchema = yup.boolean();
      if (fieldConfig.default !== undefined) {
        fieldSchema = fieldSchema.default(fieldConfig.default);
      }
    }
    
    if (fieldConfig.type === 'array') {
      fieldSchema = yup.array();
      if (fieldConfig.arrayOf) {
        fieldSchema = fieldSchema.of(fieldConfig.arrayOf);
      }
    }
    
    schema[field] = fieldSchema;
  });
  
  return yup.object().shape(schema);
};

/**
 * Helper function to validate CLI arguments with Yup
 * @param {Object} args - CLI arguments
 * @param {Object} options - CLI options
 * @param {Object} generator - Generator instance
 * @param {Object} schema - Yup validation schema
 * @returns {Promise<Object>} Validation result
 */
const validateCliArguments = async (args, options, generator, schema) => {
  try {
    const dataToValidate = { ...args, ...options };
    const validatedData = await schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    return { isValid: true, data: validatedData, errors: null };
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = error.inner.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      return { isValid: false, data: null, errors };
    }
    throw error;
  }
};

/**
 * Helper function to check if CLI arguments are provided
 * @param {Object} args - CLI arguments
 * @param {Array} requiredArgs - Array of required argument names
 * @returns {boolean} True if all required arguments are provided
 */
const hasCliArgs = (args, requiredArgs) => {
  return requiredArgs.every(argName => args[argName] !== undefined && args[argName] !== null && args[argName] !== '');
};

/**
 * Helper function to display validation errors
 * @param {Object} generator - Generator instance
 * @param {Array} errors - Array of validation errors
 */
const displayValidationErrors = (generator, errors) => {
  generator.log(yosay(chalk.red("Validation errors found:")));
  errors.forEach(error => {
    generator.log(chalk.red(`  • ${error.field}: ${error.message}`));
  });
  generator.log(chalk.yellow("\nPlease fix the errors and try again."));
};

/**
 * Helper function to get available cookie roles
 * @param {Object} generator - Generator instance
 * @returns {Array} Array of available cookie roles
 */
const getAvailableCookieRoles = (generator) => {
  const config = getGenygConfigFile(generator);
  return config.cookieRoles || [];
};

/**
 * Helper function to get available SPAs
 * @param {Object} generator - Generator instance
 * @returns {Array} Array of available SPAs
 */
const getAvailableSpas = (generator) => {
  return getSpas(generator);
};

/**
 * Common validation schemas for different field types
 */
const commonSchemas = {
  // Route validation (for API endpoints)
  route: {
    required: true,
    requiredMessage: "Route path is required",
    minLength: 1,
    minLengthMessage: "Route path cannot be empty",
    pattern: /^[a-zA-Z0-9\/\{\}\-]+$/,
    patternMessage: "Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed",
    customValidation: {
      name: "valid-route-format",
      message: "Route path format is invalid",
      test: function(value) {
        if (!value) return true;
        
        const paramRegex = /\{[^}]*\}/g;
        const matches = value.match(paramRegex);
        
        if (matches) {
          for (const match of matches) {
            const paramName = match.slice(1, -1);
            if (!paramName || paramName.length === 0) {
              return this.createError({ message: "Parameter name cannot be empty inside curly braces" });
            }
            if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(paramName)) {
              return this.createError({ message: `Parameter name '${paramName}' must start with a letter and contain only letters and numbers` });
            }
          }
        }
        
        return true;
      }
    }
  },
  
  // HTTP method validation
  method: {
    required: true,
    requiredMessage: "HTTP method is required",
    oneOf: ["get", "post", "put", "patch", "delete"],
    oneOfMessage: "HTTP method must be one of: get, post, put, patch, delete"
  },
  
  // Name validation (for components, models, etc.)
  name: {
    required: true,
    requiredMessage: "Name is required",
    minLength: 1,
    minLengthMessage: "Name cannot be empty",
    pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
    patternMessage: "Name must start with a letter and contain only letters and numbers"
  },
  
  // Location validation (for models)
  location: {
    required: true,
    requiredMessage: "Location is required",
    oneOf: ["client", "server", "common"],
    oneOfMessage: "Location must be one of: client, server, common"
  },
  
  // Cookie authentication
  useCookieAuth: {
    type: "boolean",
    default: false
  },
  
  // Cookie role (dynamic based on available roles)
  cookieRole: {
    conditional: {
      field: "useCookieAuth",
      value: true,
      then: (schema) => schema
        .required("Cookie role is required when using cookie authentication")
        .min(1, "Cookie role cannot be empty"),
      otherwise: (schema) => schema.nullable()
    }
  },
  
  // Rendering strategy validation
  renderingStrategy: {
    required: true,
    requiredMessage: "Rendering strategy is required",
    oneOf: ["none", "Static Generation Props (SSG)", "Server-side Rendering Props (SSR)"],
    oneOfMessage: "Rendering strategy must be one of: none, Static Generation Props (SSG), Server-side Rendering Props (SSR)"
  },
  
  // Boolean flag validation
  useSagas: {
    type: "boolean",
    default: true
  }
};

module.exports = {
  createCliConfig,
  createValidationSchema,
  validateCliArguments,
  hasCliArgs,
  displayValidationErrors,
  getAvailableCookieRoles,
  getAvailableSpas,
  commonSchemas
};
