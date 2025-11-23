# React Quill Integration in pkg-mui

## Overview
The `pkg-mui` generator now includes full React Quill integration for rich text editing capabilities.

## New Components Added

### 1. FormRichTextField
- **Location**: `src/components/_form/FormRichTextField/`
- **Purpose**: Rich text editor component for forms
- **Features**:
  - Full React Quill toolbar with headers, formatting, lists, alignment, etc.
  - Integration with React Hook Form
  - Error handling and validation support
  - Customizable styling

### 2. HTMLText
- **Location**: `src/components/HTMLText/`
- **Purpose**: Component for rendering HTML content with proper styling
- **Features**:
  - Complete HTML tag support (p, ul, ol, li, h1-h6, strong, em, etc.)
  - React Quill class support (ql-align-*, ql-indent-*, ql-size-*, etc.)
  - Proper list styling with bullets and numbers
  - Responsive design with MUI theme integration

## Dependencies Added
- `react-quill`: "2.0.0" - Rich text editor library

## CSS Integration
- **Global CSS**: React Quill styles are automatically imported in `_app.tsx`
- **Custom Styles**: HTML tag support is added via injected CSS
- **Editor Styles**: Standard HTML tags work within the React Quill editor

## Usage Examples

### FormRichTextField
```tsx
import { FormRichTextField } from "@/components/_form/FormRichTextField";

<FormRichTextField
  name="description"
  label="Description"
  placeholder="Enter your description..."
  required
/>
```

### HTMLText
```tsx
import { HTMLText } from "@/components/HTMLText";

<HTMLText html={member.notes} />
```

## Features Supported

### Rich Text Editor
- Headers (H1-H6)
- Bold, italic, underline, strikethrough
- Lists (ordered and unordered)
- Text alignment (left, center, right, justify)
- Text indentation
- Text and background colors
- Links
- Blockquotes

### HTML Rendering
- All standard HTML tags
- React Quill specific classes
- Proper list styling
- Responsive typography
- Theme-aware styling

## Automatic Integration
When running `yo g-next:pkg-mui`, the generator will:
1. Install React Quill dependency
2. Copy FormRichTextField and HTMLText components
3. Add CSS imports to existing `_app.tsx`
4. Inject custom styles for HTML tag support

## Backward Compatibility
- Existing projects are not affected
- CSS is only added if not already present
- No breaking changes to existing components
