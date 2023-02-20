module.exports = ({
  roles,
  projectName,
}) =>
`// this file is a wrapper with defaults to be used in both API routes and \`getServerSideProps\` functions
import type { IronSessionOptions } from "iron-session";
${roles.forEach(role => `
import { Session${role} } from "models/server/${role}";
`)}
${roles.forEach(role=>`
export const ${role.toLowerCase()}SessionOptions: IronSessionOptions = {
  password: process.env.${role.toUpperCase()}_SECRET_COOKIE_PASSWORD as string,
  cookieName: "${projectName.toLowerCase()}-cookie-auth",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
`)}
// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    ${roles.forEach(role=>
  `${role.toLowerCase()}?: Session${role};`
)}
  }
}
`;
