# Form Component Generator (comp-form)

Generates form components in the `_form` directory with standardized structure including hooks separation.

## Prerequisites
- Requires `pkg-core` package
- Requires `pkg-mui` package

## Usage

### CLI Mode
```bash
yo g-next:comp-form --componentName TextField
yo g-next:comp-form --componentName CustomInput
yo g-next:comp-form --componentName DateRangePicker
```

### Interactive Mode
```bash
yo g-next:comp-form
```

## Parameters

### `--componentName` (required)
The name of the form component.
- Will be automatically prefixed with "Form" if not already present
- Will be converted to PascalCase
- Example: `TextField` becomes `FormTextField`
- Example: `FormCustomInput` stays `FormCustomInput`

## Generated Structure

The generator creates the following files in `src/components/_form/{FormComponentName}/`:

```
src/components/_form/FormTextField/
├── index.tsx           # React component with UI
└── index.hooks.tsx     # Business logic and form integration
```

## Generated Template

### index.tsx
- React component using `memo`
- Accepts `name` prop (required) and extends MUI `TextFieldProps`
- Uses the custom hook from `index.hooks.tsx`
- Handles error state and helper text automatically
- Follows Form Component Standards from the project

### index.hooks.tsx
- Custom hook that uses `useFormField` from `@/hooks/useFormField`
- Handles form value and onChange logic
- Returns `{ value, handleChange, error }`
- Type-safe with TypeScript

## Examples

### Generate a custom date input component
```bash
yo g-next:comp-form --componentName DateInput
```

### Generate a custom select component
```bash
yo g-next:comp-form --componentName CustomSelect
```

### Generate a specialized input
```bash
yo g-next:comp-form --componentName PhoneInput
```

## Customization

After generation, you can customize:
1. Change the base MUI component (TextField, Select, etc.)
2. Add custom props to the Props interface
3. Modify the hook logic for specific form field behavior
4. Add validation or transformation logic
5. Update the type parameter in `useFormField<T>` to match your data type

## Notes

- The "Form" prefix is automatically added if not present in the component name
- All generated components follow the React Component Architecture Standards
- Components are generated in the `_form` directory to maintain organization
- Each component has separated concerns: UI in `index.tsx`, logic in `index.hooks.tsx`
- Generated components integrate with react-hook-form through `useFormField` hook

