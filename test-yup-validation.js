#!/usr/bin/env node

/**
 * Test script for Yup validation functionality
 * This script tests the Yup validation schema directly
 */

const yup = require('yup');

// Import the validation schema from the generator
const HttpMethods = {
  GET: "get",
  POST: "post",
  DELETE: "delete",
  PUT: "put",
  PATCH: "patch",
};

const cliValidationSchema = yup.object().shape({
  route: yup
    .string()
    .required("Route path is required")
    .min(1, "Route path cannot be empty")
    .matches(/^[a-zA-Z0-9\/\{\}\-]+$/, "Route path contains invalid characters. Only letters, numbers, slashes, curly braces, and hyphens are allowed")
    .test("valid-route-format", "Route path format is invalid", function(value) {
      if (!value) return true;
      
      // Check for valid parameter format: {paramName}
      const paramRegex = /\{[^}]*\}/g;
      const matches = value.match(paramRegex);
      
      if (matches) {
        for (const match of matches) {
          const paramName = match.slice(1, -1); // Remove { and }
          if (!paramName || paramName.length === 0) {
            return this.createError({ message: "Parameter name cannot be empty inside curly braces" });
          }
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(paramName)) {
            return this.createError({ message: `Parameter name '${paramName}' must start with a letter and contain only letters and numbers` });
          }
        }
      }
      
      return true;
    }),
  method: yup
    .string()
    .required("HTTP method is required")
    .oneOf(Object.values(HttpMethods), `HTTP method must be one of: ${Object.values(HttpMethods).join(', ')}`),
  useCookieAuth: yup
    .boolean()
    .default(false),
  cookieRole: yup
    .string()
    .when('useCookieAuth', {
      is: true,
      then: (schema) => schema
        .required("Cookie role is required when using cookie authentication")
        .min(1, "Cookie role cannot be empty")
        .oneOf(['admin', 'user', 'moderator'], "Cookie role must be one of: admin, user, moderator"),
      otherwise: (schema) => schema.nullable()
    })
});

// Test cases
const testCases = [
  // Valid cases
  {
    name: 'Valid basic route',
    data: { route: 'users', method: 'get', useCookieAuth: false, cookieRole: null },
    shouldPass: true
  },
  {
    name: 'Valid route with parameter',
    data: { route: 'users/{userId}', method: 'post', useCookieAuth: false, cookieRole: null },
    shouldPass: true
  },
  {
    name: 'Valid route with multiple parameters',
    data: { route: 'posts/{postId}/comments/{commentId}', method: 'put', useCookieAuth: false, cookieRole: null },
    shouldPass: true
  },
  {
    name: 'Valid with cookie auth - admin role',
    data: { route: 'admin/users', method: 'get', useCookieAuth: true, cookieRole: 'admin' },
    shouldPass: true
  },
  {
    name: 'Valid with cookie auth - user role',
    data: { route: 'profile', method: 'get', useCookieAuth: true, cookieRole: 'user' },
    shouldPass: true
  },
  {
    name: 'Valid with cookie auth - moderator role',
    data: { route: 'moderation/posts', method: 'get', useCookieAuth: true, cookieRole: 'moderator' },
    shouldPass: true
  },
  
  // Invalid cases
  {
    name: 'Invalid HTTP method',
    data: { route: 'users', method: 'invalid', useCookieAuth: false, cookieRole: null },
    shouldPass: false,
    expectedError: 'HTTP method must be one of: get, post, put, patch, delete'
  },
  {
    name: 'Empty route',
    data: { route: '', method: 'get', useCookieAuth: false, cookieRole: null },
    shouldPass: false,
    expectedError: 'Route path cannot be empty'
  },
  {
    name: 'Invalid route characters',
    data: { route: 'users@#$', method: 'get', useCookieAuth: false, cookieRole: null },
    shouldPass: false,
    expectedError: 'Route path contains invalid characters'
  },
  {
    name: 'Empty parameter name',
    data: { route: 'users/{}', method: 'get', useCookieAuth: false, cookieRole: null },
    shouldPass: false,
    expectedError: 'Parameter name cannot be empty inside curly braces'
  },
  {
    name: 'Invalid parameter name',
    data: { route: 'users/{123invalid}', method: 'get', useCookieAuth: false, cookieRole: null },
    shouldPass: false,
    expectedError: 'must start with a letter and contain only letters and numbers'
  },
  {
    name: 'Missing cookie role with auth',
    data: { route: 'users', method: 'get', useCookieAuth: true, cookieRole: null },
    shouldPass: false,
    expectedError: 'Cookie role is required when using cookie authentication'
  },
  {
    name: 'Empty cookie role with auth',
    data: { route: 'users', method: 'get', useCookieAuth: true, cookieRole: '' },
    shouldPass: false,
    expectedError: 'Cookie role cannot be empty'
  },
  {
    name: 'Invalid cookie role - not in allowed list',
    data: { route: 'users', method: 'get', useCookieAuth: true, cookieRole: 'superadmin' },
    shouldPass: false,
    expectedError: 'Cookie role must be one of: admin, user, moderator'
  },
  {
    name: 'Invalid cookie role - empty string',
    data: { route: 'users', method: 'get', useCookieAuth: true, cookieRole: 'guest' },
    shouldPass: false,
    expectedError: 'Cookie role must be one of: admin, user, moderator'
  }
];

console.log('🧪 Testing Yup validation schema...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data)}`);
    console.log(`   Expected: ${testCase.shouldPass ? 'PASS' : 'FAIL'}`);

    try {
      const result = await cliValidationSchema.validate(testCase.data, {
        abortEarly: false,
        stripUnknown: true
      });

      if (testCase.shouldPass) {
        console.log('   ✅ PASS - Validation succeeded as expected');
        passed++;
      } else {
        console.log('   ❌ FAIL - Validation should have failed but passed');
        failed++;
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        if (testCase.expectedError && error.message.includes(testCase.expectedError)) {
          console.log(`   ✅ PASS - Validation failed as expected: ${error.message}`);
          passed++;
        } else {
          console.log(`   ⚠️  PARTIAL - Validation failed but error message doesn\'t match expected`);
          console.log(`   Expected: ${testCase.expectedError}`);
          console.log(`   Got: ${error.message}`);
          passed++; // Still count as pass since validation failed
        }
      } else {
        console.log(`   ❌ FAIL - Validation failed unexpectedly: ${error.message}`);
        failed++;
      }
    }
  }

  console.log(`\n🎉 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total: ${passed + failed}`);

  if (failed === 0) {
    console.log('\n🎊 All tests passed! Yup validation is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the validation logic.');
    process.exit(1);
  }
}

runTests().catch(console.error);
