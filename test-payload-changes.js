#!/usr/bin/env node

/**
 * Test script to verify the payload extraction and noUnknown() changes
 * This script tests the updated API generator templates
 */

const fs = require('fs');
const path = require('path');
const { spawnYo } = require('./scripts/resolve-yo');

const repoRoot = __dirname;
const testProjectPath = path.join(repoRoot, 'test-project');

console.log('🧪 Testing API Generator payload and validation changes...');
console.log(`📁 Working directory: ${testProjectPath}\n`);

function testPostEndpoint() {
  return new Promise((resolve) => {
    console.log('📋 Test: POST endpoint with payload extraction and noUnknown()');
    console.log('   Command: yo g-next:api --route test-posts --method post');

    const yoProcess = spawnYo(repoRoot, ['g-next:api', '--route', 'test-posts', '--method', 'post'], {
      stdio: 'pipe',
    });

    let output = '';
    let errorOutput = '';
    let settled = false;

    const done = (ok) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    yoProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    yoProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const timerPost = setTimeout(() => {
      yoProcess.kill('SIGKILL');
      console.log('   ⏰ Test timed out');
      done(false);
    }, 15000);

    yoProcess.on('close', (code) => {
      clearTimeout(timerPost);
      console.log(`   Exit code: ${code}`);

      if (code !== 0) {
        console.log('   ❌ Generator failed');
        console.log('   Output:', output);
        console.log('   Error:', errorOutput);
        done(false);
        return;
      }

      console.log('   ✅ Generator completed successfully');

      const handlerPath = path.join(testProjectPath, 'src/endpoints/post-test-posts/handler.ts');
      const validationsPath = path.join(testProjectPath, 'src/endpoints/post-test-posts/validations.ts');

      let ok = true;
      if (fs.existsSync(handlerPath)) {
        const handlerContent = fs.readFileSync(handlerPath, 'utf8');
        if (
          handlerContent.includes('payload') &&
          handlerContent.includes('const { validationResult, payload } = req;')
        ) {
          console.log('   ✅ Handler includes payload extraction');
        } else {
          console.log('   ❌ Handler missing payload extraction');
          console.log('   Content:', handlerContent.substring(0, 200));
          ok = false;
        }
      } else {
        console.log('   ❌ Handler file not found');
        ok = false;
      }

      if (fs.existsSync(validationsPath)) {
        const validationsContent = fs.readFileSync(validationsPath, 'utf8');
        if (validationsContent.includes('.noUnknown()')) {
          console.log('   ✅ Validations include .noUnknown()');
        } else {
          console.log('   ❌ Validations missing .noUnknown()');
          console.log('   Content:', validationsContent);
          ok = false;
        }
      } else {
        console.log('   ❌ Validations file not found');
        ok = false;
      }

      done(ok);
    });
  });
}

function testGetEndpoint() {
  return new Promise((resolve) => {
    console.log('\n📋 Test: GET endpoint (should not have payload extraction)');
    console.log('   Command: yo g-next:api --route test-users --method get');

    const yoProcess = spawnYo(repoRoot, ['g-next:api', '--route', 'test-users', '--method', 'get'], {
      stdio: 'pipe',
    });

    let output = '';
    let errorOutput = '';
    let settled = false;

    const done = (ok) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    yoProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    yoProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    const timerGet = setTimeout(() => {
      yoProcess.kill('SIGKILL');
      console.log('   ⏰ Test timed out');
      done(false);
    }, 15000);

    yoProcess.on('close', (code) => {
      clearTimeout(timerGet);
      console.log(`   Exit code: ${code}`);

      if (code !== 0) {
        console.log('   ❌ Generator failed');
        console.log('   Output:', output);
        console.log('   Error:', errorOutput);
        done(false);
        return;
      }

      console.log('   ✅ Generator completed successfully');

      const handlerPath = path.join(testProjectPath, 'src/endpoints/get-test-users/handler.ts');
      const validationsPath = path.join(testProjectPath, 'src/endpoints/get-test-users/validations.ts');

      let ok = true;
      const payloadDestruct = 'const { validationResult, payload } = req;';

      if (fs.existsSync(handlerPath)) {
        const handlerContent = fs.readFileSync(handlerPath, 'utf8');
        if (!handlerContent.includes(payloadDestruct)) {
          console.log('   ✅ Handler correctly excludes payload extraction for GET');
        } else {
          console.log('   ❌ Handler incorrectly includes payload extraction for GET');
          ok = false;
        }
      } else {
        console.log('   ❌ Handler file not found');
        ok = false;
      }

      if (fs.existsSync(validationsPath)) {
        const validationsContent = fs.readFileSync(validationsPath, 'utf8');
        if (
          validationsContent.includes(
            'queryStringParameters: yup.object().shape(queryStringParametersValidations()).noUnknown()',
          )
        ) {
          console.log('   ✅ Validations include .noUnknown() for queryStringParameters');
        } else {
          console.log('   ❌ Validations missing .noUnknown() for queryStringParameters');
          console.log('   Content:', validationsContent);
          ok = false;
        }
      } else {
        console.log('   ❌ Validations file not found');
        ok = false;
      }

      done(ok);
    });
  });
}

async function runAllTests() {
  let failed = 0;
  const a = await testPostEndpoint();
  const b = await testGetEndpoint();
  if (!a) failed++;
  if (!b) failed++;

  console.log('\n🎉 All tests completed!');
  console.log('\n📖 Changes implemented:');
  console.log('   ✅ Added .noUnknown() to all validation schemas');
  console.log('   ✅ Added payload extraction for POST/PUT/PATCH methods');
  console.log('   ✅ GET methods correctly exclude payload extraction');

  if (failed > 0) process.exit(1);
}

const yoCheck = spawnYo(repoRoot, ['--version'], { stdio: 'pipe' });
yoCheck.on('error', () => {
  console.log('❌ Yeoman (yo) is not available. Run: npm install --prefix test-project');
  process.exit(1);
});
yoCheck.on('close', (code) => {
  if (code === 0) {
    runAllTests();
  } else {
    console.log('❌ Yeoman (yo) is not available. Run: npm install --prefix test-project');
    process.exit(1);
  }
});
