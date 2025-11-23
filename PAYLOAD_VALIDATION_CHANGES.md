# GeNYG API Generator - Payload and Validation Updates

## Overview
Updated the GeNYG API generator to automatically include payload extraction and `.noUnknown()` validation for all API endpoints.

## Changes Made

### 1. Validation Template Updates (`templates/endpoint/validations.js`)
- **Added `.noUnknown()` to all validation schemas**
- Both `queryStringParameters` and `payload` now include `.noUnknown()`
- This ensures that unexpected fields are rejected during validation

**Before:**
```javascript
export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()),
  payload: yup.object().shape(payloadValidations()),
});
```

**After:**
```javascript
export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()).noUnknown(),
  payload: yup.object().shape(payloadValidations()).noUnknown(),
});
```

### 2. Handler Template Updates (`templates/endpoint/handler.js`)
- **Added payload extraction for POST, PUT, and PATCH methods**
- Updated function signature to accept `hasPayload` parameter
- Automatically includes `payload` in destructuring when `hasPayload` is true

**Before:**
```javascript
const { validationResult, queryStringParameters } = req;
```

**After (for POST/PUT/PATCH):**
```javascript
const { validationResult, queryStringParameters, payload } = req;
```

### 3. Main Generator Updates (`generators/api/index.js`)
- **Updated handler template call to pass `hasPayload` parameter**
- The generator already determines `hasPayload` based on HTTP method
- Now passes this information to the handler template

## Benefits

### Security Improvements
- **Strict Validation**: `.noUnknown()` prevents injection of unexpected fields
- **Type Safety**: Payload extraction follows the established GeNYG pattern
- **Consistency**: All APIs now follow the same validation and extraction patterns

### Developer Experience
- **Automatic Setup**: No need to manually add `.noUnknown()` to validations
- **Consistent Patterns**: All POST/PUT/PATCH endpoints automatically include payload extraction
- **Type Safety**: Payload is properly typed according to the interface

## Generated Code Examples

### POST Endpoint Handler
```typescript
export default async function handler(
  req: PostTestPostsApi.Request,
  res: NextApiResponse<PostTestPostsApi.EndpointResponse>,
) {
  try {
    const { validationResult, payload } = req;
    
    // Payload is automatically available and typed
    const { title, content } = payload;
    
    // ... rest of handler logic
  } catch (e) {
    // ... error handling
  }
}
```

### Validation Schema
```typescript
export default () => ({
  queryStringParameters: yup.object().shape(queryStringParametersValidations()).noUnknown(),
  payload: yup.object().shape(payloadValidations()).noUnknown(),
});
```

## Testing
- Created `test-payload-changes.js` to verify the changes work correctly
- Tests both POST (with payload) and GET (without payload) endpoints
- Verifies that `.noUnknown()` is added to all validation schemas
- Confirms payload extraction is only added for appropriate HTTP methods

## Backward Compatibility
- ✅ **Fully backward compatible**
- Existing projects will continue to work without changes
- New endpoints generated will automatically include the improvements
- No breaking changes to existing APIs

## Usage
The changes are automatically applied when generating new API endpoints:

```bash
# POST endpoint - will include payload extraction and noUnknown()
yo g-next:api --route posts --method post

# PUT endpoint - will include payload extraction and noUnknown()
yo g-next:api --route posts/{postId} --method put

# GET endpoint - will only include noUnknown() for queryStringParameters
yo g-next:api --route posts --method get
```

## Files Modified
1. `generators/api/templates/endpoint/validations.js` - Added `.noUnknown()` to validation schemas
2. `generators/api/templates/endpoint/handler.js` - Added payload extraction for POST/PUT/PATCH
3. `generators/api/index.js` - Updated to pass `hasPayload` parameter to handler template
4. `test-payload-changes.js` - Created test script to verify changes
5. `PAYLOAD_VALIDATION_CHANGES.md` - This documentation file
