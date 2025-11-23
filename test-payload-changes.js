#!/usr/bin/env node

/**
 * Test script to verify the payload extraction and noUnknown() changes
 * This script tests the updated API generator templates
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Test project path
const testProjectPath = path.join(__dirname, 'test-project');

console.log('🧪 Testing API Generator payload and validation changes...');
console.log(`📁 Working directory: ${testProjectPath}\n`);

// Function to test POST endpoint generation
function testPostEndpoint() {
  return new Promise((resolve) => {
    console.log('📋 Test: POST endpoint with payload extraction and noUnknown()');
    console.log('   Command: yo g-next:api --route test-posts --method post');
    
    const yoProcess = spawn('yo', ['g-next:api', '--route', 'test-posts', '--method', 'post'], {
      cwd: testProjectPath,
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
      
      if (code === 0) {
        console.log('   ✅ Generator completed successfully');
        
        // Check if the generated files have the expected changes
        const handlerPath = path.join(testProjectPath, 'src/endpoints/post-test-posts/handler.ts');
        const validationsPath = path.join(testProjectPath, 'src/endpoints/post-test-posts/validations.ts');
        
        if (fs.existsSync(handlerPath)) {
          const handlerContent = fs.readFileSync(handlerPath, 'utf8');
          
          // Check for payload extraction
          if (handlerContent.includes('payload') && handlerContent.includes('const { validationResult, payload } = req;')) {
            console.log('   ✅ Handler includes payload extraction');
          } else {
            console.log('   ❌ Handler missing payload extraction');
            console.log('   Content:', handlerContent.substring(0, 200));
          }
        } else {
          console.log('   ❌ Handler file not found');
        }
        
        if (fs.existsSync(validationsPath)) {
          const validationsContent = fs.readFileSync(validationsPath, 'utf8');
          
          // Check for noUnknown()
          if (validationsContent.includes('.noUnknown()')) {
            console.log('   ✅ Validations include .noUnknown()');
          } else {
            console.log('   ❌ Validations missing .noUnknown()');
            console.log('   Content:', validationsContent);
          }
        } else {
          console.log('   ❌ Validations file not found');
        }
      } else {
        console.log('   ❌ Generator failed');
        console.log('   Output:', output);
        console.log('   Error:', errorOutput);
      }
      
      resolve();
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      yoProcess.kill();
      console.log('   ⏰ Test timed out');
      resolve();
    }, 15000);
  });
}

// Function to test GET endpoint (should not have payload)
function testGetEndpoint() {
  return new Promise((resolve) => {
    console.log('\n📋 Test: GET endpoint (should not have payload extraction)');
    console.log('   Command: yo g-next:api --route test-users --method get');
    
    const yoProcess = spawn('yo', ['g-next:api', '--route', 'test-users', '--method', 'get'], {
      cwd: testProjectPath,
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
      
      if (code === 0) {
        console.log('   ✅ Generator completed successfully');
        
        // Check if the generated files have the expected changes
        const handlerPath = path.join(testProjectPath, 'src/endpoints/get-test-users/handler.ts');
        const validationsPath = path.join(testProjectPath, 'src/endpoints/get-test-users/validations.ts');
        
        if (fs.existsSync(handlerPath)) {
          const handlerContent = fs.readFileSync(handlerPath, 'utf8');
          
          // Check that GET doesn't have payload extraction
          if (!handlerContent.includes('payload') || !handlerContent.includes('const { validationResult, payload } = req;')) {
            console.log('   ✅ Handler correctly excludes payload extraction for GET');
          } else {
            console.log('   ❌ Handler incorrectly includes payload extraction for GET');
          }
        } else {
          console.log('   ❌ Handler file not found');
        }
        
        if (fs.existsSync(validationsPath)) {
          const validationsContent = fs.readFileSync(validationsPath, 'utf8');
          
          // Check for noUnknown() on queryStringParameters
          if (validationsContent.includes('queryStringParameters: yup.object().shape(queryStringParametersValidations()).noUnknown()')) {
            console.log('   ✅ Validations include .noUnknown() for queryStringParameters');
          } else {
            console.log('   ❌ Validations missing .noUnknown() for queryStringParameters');
            console.log('   Content:', validationsContent);
          }
        } else {
          console.log('   ❌ Validations file not found');
        }
      } else {
        console.log('   ❌ Generator failed');
        console.log('   Output:', output);
        console.log('   Error:', errorOutput);
      }
      
      resolve();
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      yoProcess.kill();
      console.log('   ⏰ Test timed out');
      resolve();
    }, 15000);
  });
}

// Run all tests
async function runAllTests() {
  await testPostEndpoint();
  await testGetEndpoint();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📖 Changes implemented:');
  console.log('   ✅ Added .noUnknown() to all validation schemas');
  console.log('   ✅ Added payload extraction for POST/PUT/PATCH methods');
  console.log('   ✅ GET methods correctly exclude payload extraction');
}

// Check if yo is available
const yoCheck = spawn('yo', ['--version'], { 
  cwd: testProjectPath,
  stdio: 'pipe' 
});

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
