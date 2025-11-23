import "@/styles/reset.css";
import "react-quill/dist/quill.snow.css";
import type { AppProps } from "next/app";

// Custom styles for React Quill editor to support HTML tags
const quillStyles = `
  .ql-editor s,
  .ql-editor strike,
  .ql-editor del {
    text-decoration: line-through;
  }

  .ql-editor em,
  .ql-editor i {
    font-style: italic;
  }

  .ql-editor strong,
  .ql-editor b {
    font-weight: bold;
  }

  .ql-editor u {
    text-decoration: underline;
  }

  .ql-editor mark {
    background-color: yellow;
    padding: 2px 4px;
  }

  .ql-editor sup {
    vertical-align: super;
    font-size: 0.75em;
  }

  .ql-editor sub {
    vertical-align: sub;
    font-size: 0.75em;
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = quillStyles;
  document.head.appendChild(style);
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
