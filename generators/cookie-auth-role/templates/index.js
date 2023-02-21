


function importing(roles){
  let imported = "";
  for (let i=0 ; i<roles.length ; i++) {
    imported = imported.concat(
      `import { Session${roles[i]} } from "src/models/server/${roles[i]}";\n`
    );
  }
  return imported;
}

function exporting(roles,projectName){
  let exported = "";
  for(let i=0 ; i<roles.length ; i++) {
    exported = exported.concat(
      `
export const ${roles[i].toLowerCase()}SessionOptions: IronSessionOptions = {
  password: process.env.${roles[i].toUpperCase()}_SECRET_COOKIE_PASSWORD as string,
  cookieName: "${projectName.toLowerCase()}-cookie-auth",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
`
    );
  }
  return exported;
}

function interfacing(roles){
  let interfaced = "";
  for(let i=0 ; i<roles.length ; i++) {
    interfaced = interfaced.concat(
      `${roles[i].toLowerCase()}?: Session${roles[i]};\n    `
    );
  }
  return interfaced;
}

module.exports = ({
  roles,
  projectName,
}) =>
`// this file is a wrapper with defaults to be used in both API routes and \`getServerSideProps\` functions
import type { IronSessionOptions } from "iron-session";
${importing(roles)}
${exporting(roles,projectName)}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    ${interfacing(roles)}
  }
}
`;
