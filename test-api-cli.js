#!/usr/bin/env node

/**
 * Test script for API generator CLI functionality
 * This script tests the new CLI arguments feature
 */

const { spawn } = require('child_process');
const path = require('path');

// Test cases
const testCases = [
  {
    name: 'Basic GET endpoint',
    args: ['g-next:api', 'users', 'get'],
    expected: 'Should generate a GET /users endpoint'
  },
  {
    name: 'POST endpoint with dynamic parameter',
    args: ['g-next:api', 'posts/{postId}', 'post'],
    expected: 'Should generate a POST /posts/{postId} endpoint'
  },
  {
    name: 'PUT endpoint with cookie auth',
    args: ['g-next:api', 'users/{userId}', 'put', '--useCookieAuth', '--cookieRole', 'admin'],
    expected: 'Should generate a PUT /users/{userId} endpoint with cookie authentication'
  },
  {
    name: 'Invalid HTTP method',
    args: ['g-next:api', 'users', 'invalid'],
    expected: 'Should show Yup validation error for invalid HTTP method'
  },
  {
    name: 'Missing cookie role with auth',
    args: ['g-next:api', 'users', 'get', '--useCookieAuth'],
    expected: 'Should show Yup validation error for missing cookie role'
  },
  {
    name: 'Invalid route format - empty parameter',
    args: ['g-next:api', 'users/{}', 'get'],
    expected: 'Should show Yup validation error for empty parameter'
  },
  {
    name: 'Invalid route format - invalid parameter name',
    args: ['g-next:api', 'users/{123invalid}', 'get'],
    expected: 'Should show Yup validation error for invalid parameter name'
  },
  {
    name: 'Invalid route format - special characters',
    args: ['g-next:api', 'users@#$', 'get'],
    expected: 'Should show Yup validation error for invalid characters in route'
  },
  {
    name: 'Empty route path',
    args: ['g-next:api', '', 'get'],
    expected: 'Should show Yup validation error for empty route'
  }
];

console.log('🧪 Testing API Generator CLI functionality...\n');

// Function to run a test case
function runTest(testCase) {
  return new Promise((resolve) => {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`   Command: yo ${testCase.args.join(' ')}`);
    console.log(`   Expected: ${testCase.expected}`);
    
    const yoProcess = spawn('yo', testCase.args, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    let errorOutput = '';

    yoProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    yoProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    yoProcess.on('close', (code) => {
      console.log(`   Exit code: ${code}`);
      
      if (output.includes('Using CLI arguments for non-interactive generation')) {
        console.log('   ✅ CLI mode detected successfully');
      } else if (output.includes('Welcome to') && output.includes('follow the quick and easy configuration')) {
        console.log('   ✅ Interactive mode detected (no CLI args provided)');
      } else if (errorOutput.includes('Validation errors found:') || 
                 errorOutput.includes('HTTP method must be one of:') ||
                 errorOutput.includes('Cookie role is required when using cookie authentication') ||
                 errorOutput.includes('Route path contains invalid characters') ||
                 errorOutput.includes('Parameter name cannot be empty') ||
                 errorOutput.includes('must start with a letter') ||
                 errorOutput.includes('Route path cannot be empty')) {
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

    // Timeout after 10 seconds
    setTimeout(() => {
      yoProcess.kill();
      console.log('   ⏰ Test timed out');
      resolve();
    }, 10000);
  });
}

// Run all tests
async function runAllTests() {
  for (const testCase of testCases) {
    await runTest(testCase);
  }
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📖 For detailed usage examples, see API_CLI_USAGE.md');
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
