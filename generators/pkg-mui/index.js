"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const {
  getGenygConfigFile,
  extendConfigFile,
  requirePackages,
} = require("../../common");

module.exports = class extends Generator {
  async prompting() {
    // Config checks
    requirePackages(this, ["core"]);

    this.log(
      yosay(
        `Hi! Welcome to the official ${chalk.blue(
          "Getapper NextJS Yeoman Generator (GeNYG)",
        )}. ${chalk.red(
          "This command must be executed only once, and it will install al MUI dependencies.",
        )}`,
      ),
    );

    this.answers = await this.prompt([
      {
        type: "confirm",
        name: "accept",
        message: "Are you sure to proceed?",
      },
    ]);

    if (!this.answers.accept) {
      process.exit(0);
    }
  }

  writing() {
    // Config checks
    const configFile = getGenygConfigFile(this);
    if (configFile.packages.mui) {
      this.log(
        yosay(
          chalk.red(
            "It looks like the GeNYG MUI files were already installed!",
          ),
        ),
      );
      process.exit(0);
    }

    // New dependencies
    this.packageJson.merge({
      dependencies: {
        "@emotion/react": "11.11.0",
        "@emotion/styled": "11.11.0",
        "@googlemaps/js-api-loader": "2.0.1",
        "@hookform/resolvers": "2.8.8",
        "@mui/icons-material": "5.11.0",
        "@mui/material": "5.14.2",
        "@mui/x-data-grid": "6.10.0",
        "@mui/x-date-pickers": "6.10.0",
        autonumeric: "4.10.9",
        slugify: "1.6.6",
        moment: "2.29.4",
        "react-dropzone": "12.0.5",
        "react-hook-form": "7.29.0",
        "react-quill": "2.0.0",
        yup: "0.32.9",
      },
    });

    // Copy MUI form components
    this.fs.copy(this.templatePath(), this.destinationRoot());

    // Add React Quill CSS to _app.tsx if it exists
    const appTsxPath = this.destinationPath("src/pages/_app.tsx");
    if (this.fs.exists(appTsxPath)) {
      let appContent = this.fs.read(appTsxPath);
      
      // Add React Quill CSS import if not already present
      if (!appContent.includes('react-quill/dist/quill.snow.css')) {
        appContent = appContent.replace(
          'import "@/styles/reset.css";',
          'import "@/styles/reset.css";\nimport "react-quill/dist/quill.snow.css";'
        );
      }

      // Add custom React Quill styles if not already present
      if (!appContent.includes('const quillStyles =')) {
        const quillStylesCode = `
// Custom styles for React Quill editor to support HTML tags
const quillStyles = \`
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
\`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = quillStyles;
  document.head.appendChild(style);
}`;

        appContent = appContent.replace(
          'export default function App({ Component, pageProps }: AppProps) {',
          quillStylesCode + '\n\nexport default function App({ Component, pageProps }: AppProps) {'
        );
      }

      this.fs.write(appTsxPath, appContent);
    }

    extendConfigFile(this, {
      packages: {
        mui: true,
      },
    });
  }
};
