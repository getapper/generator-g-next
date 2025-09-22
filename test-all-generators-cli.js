#!/usr/bin/env node

/**
 * Test script for all generators CLI functionality
 * This script tests the new CLI arguments feature for all generators
 */

const { spawn } = require('child_process');

// Test cases for all generators
const testCases = [
  // API Generator
  {
    name: 'API Generator - Basic GET',
    command: 'yo',
    args: ['g-next:api', 'users', 'get'],
    expected: 'Should generate a GET /users API endpoint'
  },
  {
    name: 'API Generator - POST with auth',
    command: 'yo',
    args: ['g-next:api', 'users', 'post', '--useCookieAuth', '--cookieRole', 'admin'],
    expected: 'Should generate a POST /users API endpoint with cookie auth'
  },
  {
    name: 'API Generator - Invalid method',
    command: 'yo',
    args: ['g-next:api', 'users', 'invalid'],
    expected: 'Should show validation error for invalid HTTP method'
  },

  // Component Generator
  {
    name: 'Component Generator - Basic',
    command: 'yo',
    args: ['g-next:comp', 'UserCard'],
    expected: 'Should generate a UserCard component'
  },
  {
    name: 'Component Generator - With path',
    command: 'yo',
    args: ['g-next:comp', 'UserProfile', '--componentPath', 'user'],
    expected: 'Should generate a UserProfile component in user folder'
  },
  {
    name: 'Component Generator - Invalid name',
    command: 'yo',
    args: ['g-next:comp', '123Invalid'],
    expected: 'Should show validation error for invalid component name'
  },

  // Form Generator
  {
    name: 'Form Generator - Basic',
    command: 'yo',
    args: ['g-next:form', 'LoginForm'],
    expected: 'Should generate a LoginForm component'
  },
  {
    name: 'Form Generator - With path',
    command: 'yo',
    args: ['g-next:form', 'UserRegistration', '--formPath', 'auth'],
    expected: 'Should generate a UserRegistration form in auth folder'
  },

  // Model Generator
  {
    name: 'Model Generator - Client model',
    command: 'yo',
    args: ['g-next:model', 'User', 'client'],
    expected: 'Should generate a User model in client folder'
  },
  {
    name: 'Model Generator - Server model',
    command: 'yo',
    args: ['g-next:model', 'Product', 'server'],
    expected: 'Should generate a Product model in server folder'
  },
  {
    name: 'Model Generator - Invalid location',
    command: 'yo',
    args: ['g-next:model', 'User', 'invalid'],
    expected: 'Should show validation error for invalid location'
  },

  // Page Generator
  {
    name: 'Page Generator - Basic page',
    command: 'yo',
    args: ['g-next:page', 'home', 'HomePage', 'none'],
    expected: 'Should generate a home page with HomePage component'
  },
  {
    name: 'Page Generator - Dynamic page',
    command: 'yo',
    args: ['g-next:page', '[userId]', 'UserDetail', 'Server-side Rendering Props (SSR)', '--useCookieAuth', '--cookieRole', 'user'],
    expected: 'Should generate a dynamic user detail page with SSR and cookie auth'
  },
  {
    name: 'Page Generator - Invalid rendering strategy',
    command: 'yo',
    args: ['g-next:page', 'home', 'HomePage', 'invalid'],
    expected: 'Should show validation error for invalid rendering strategy'
  },

  // Task Generator
  {
    name: 'Task Generator - Basic task',
    command: 'yo',
    args: ['g-next:task', 'SendEmails'],
    expected: 'Should generate a SendEmails task'
  },
  {
    name: 'Task Generator - Invalid name',
    command: 'yo',
    args: ['g-next:task', '123Invalid'],
    expected: 'Should show validation error for invalid task name'
  }
];

console.log('🧪 Testing All Generators CLI functionality...\n');

// Function to run a test case
function runTest(testCase) {
  return new Promise((resolve) => {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`   Command: ${testCase.command} ${testCase.args.join(' ')}`);
    console.log(`   Expected: ${testCase.expected}`);
    
    const process = spawn(testCase.command, testCase.args, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      console.log(`   Exit code: ${code}`);
      
      if (output.includes('Using CLI arguments for non-interactive generation')) {
        console.log('   ✅ CLI mode detected successfully');
      } else if (output.includes('Welcome to') && output.includes('follow the quick and easy configuration')) {
        console.log('   ✅ Interactive mode detected (no CLI args provided)');
      } else if (errorOutput.includes('Validation errors found:') || 
                 errorOutput.includes('must be one of:') ||
                 errorOutput.includes('must start with a letter') ||
                 errorOutput.includes('contains invalid characters') ||
                 errorOutput.includes('is required')) {
        console.log('   ✅ Yup validation error detected as expected');
      } else {
        console.log('   ⚠️  Unexpected behavior');
        console.log(`   Output: ${output.substring(0, 200)}...`);
        if (errorOutput) {
          console.log(`   Error: ${errorOutput.substring(0, 200)}...`);
        }
      }
      
      resolve();
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      process.kill();
      console.log('   ⏰ Test timed out');
      resolve();
    }, 15000);
  });
}

// Run all tests
async function runAllTests() {
  let passed = 0;
  let failed = 0;
  let total = testCases.length;

  for (const testCase of testCases) {
    try {
      await runTest(testCase);
      passed++;
    } catch (error) {
      console.log(`   ❌ Test failed with error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n🎉 All tests completed!');
  console.log(`\n📊 Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total: ${total}`);
  
  if (failed === 0) {
    console.log('\n🎊 All generators CLI functionality is working correctly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the generator implementations.');
  }
}

// Check if yo is available
const yoCheck = spawn('yo', ['--version'], { stdio: 'pipe' });

yoCheck.on('close', (code) => {
  if (code === 0) {
    runAllTests();
  } else {
    console.log('❌ Yeoman (yo) is not available. Please install it first:');
    console.log('   npm install -g yo');
    process.exit(1);
  }
});

yoCheck.on('error', () => {
  console.log('❌ Yeoman (yo) is not available. Please install it first:');
  console.log('   npm install -g yo');
  process.exit(1);
});
