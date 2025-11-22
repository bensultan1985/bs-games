/* eslint-disable */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma, sessionService } from "../../../middleware/services";
import { v4 as uuidv4 } from "uuid";
import Cookies from "cookies";
// Modules needed to support key generation, token encryption, and HTTP cookie manipulation
import { randomUUID } from "crypto";
import { getCookie, setCookie } from "cookies-next";
import { encode, decode } from "next-auth/jwt";
import { type } from "os";

//expected production error details https://github.com/nextauthjs/next-auth/discussions/4394 bottom

export default async function handler(req, res) {
  let userAccount = null;

  const generateSessionToken = () => {
    return randomUUID?.();
  };

  const adapter = PrismaAdapter(prisma);

  const fromDate = (time, date = Date.now()) => {
    return new Date(date + time * 1000);
  };

  const callbacks = {
    async signIn({ user, account, profile, email, credentials }) {
      // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
      if (
        req.query.nextauth.includes("callback") &&
        req.query.nextauth.includes("credentials") &&
        req.method === "POST"
      ) {
        if (user) {
          const sessionToken = generateSessionToken(); // Implement a function to generate the session token (you can use randomUUID as an example)
          const sessionMaxAge = 60 * 60 * 24 * 30; //30Days
          const sessionExpiry = fromDate(sessionMaxAge); // Implement a function to calculate the session cookie expiry date
          await adapter.createSession({
            sessionToken: sessionToken,
            userId: user.id,
            expires: sessionExpiry,
          });

          setCookie("next-auth.session-token", sessionToken, {
            expires: sessionExpiry,
            req: req,
            res: res,
          });

          console.log("user Session: ", user);
        }
      }

      return true;
    },
    async register(firstName, lastName, email, password) {
      try {
        await prisma.user.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            username: email,
            email: email,
            password: password,
          },
        });
        return true;
      } catch (err) {
        console.error("Failed to register user. Error", err);
        return false;
      }
    },
    async jwt(token, user, account, profile, isNewUser) {
      // console.log("JWT callback. Got User: ", user);
      if (typeof user !== typeof undefined) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    async session(session, token) {
      console.log("Session. Got User: ", session, token);
      if (userAccount !== null) {
        console.log("UserAccount Session Generation: ", userAccount);
        session.user = {
          id: userAccount.id,
          name: `${userAccount.firstName} ${userAccount.lastName}`,
          email: userAccount.email,
          test: "test",
        };
        console.log("Session.user: ", session.user);
      } else if (
        token &&
        typeof token.user !== typeof undefined &&
        (typeof session.user === typeof undefined ||
          (typeof session.user !== typeof undefined &&
            typeof session.user.id === typeof undefined))
      ) {
        session.user = {
          email: token.user.email,
          emailVerified: token.user.emailVerified,
          image: token.user.image,
          name: token.user.name,
          type: token.user.type,
          test: "test",
        };
      } else if (typeof token !== typeof undefined) {
        session.token = token;
      }
      if (session) {
        // session.user = { ...session.user, test: "test" };
      }
      if (session?.user?.password) delete session.user.password;
      if (session?.user?.id) delete session.user.id;
      console.log("Session: ", session);
      return Promise.resolve(session);
    },
  };

  const options = {
    async redirect({ url, baseUrl }) {
      console.log("redirect", baseUrl);
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    secret: process.env.NEXTAUTH_URL,
    // session: {
    //   strategy: "jwt",
    //   maxAge: 3000,
    // },
    adapter: PrismaAdapter(prisma),
    pages: {
      signIn: "/SignIn",
    },
    session: {
      // strategy: "jwt",

      // NOTE:  If you use an `adapter` however, we default it to `"database"` instead.
      // strategy: "database", // Store sessions in the database and store a sessionToken in the cookie for lookups
      // jwt: false,

      // Seconds - How long until an idle session expires and is no longer valid.
      maxAge: 30 * 24 * 60 * 60, // 30 days

      // Seconds - Throttle how frequently to write to database to extend a session.
      // Use it to limit write operations. Set to 0 to always update the database.
      // Note: This option is ignored if using JSON Web Tokens
      updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
      // Customize the JWT encode and decode functions to overwrite the default behaviour of storing the JWT token in the session  cookie when using credentials providers. Instead we will store the session token reference to the session in the database.
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookie = getCookie("next-auth.session-token", { req: req });

          // console.log("pure Cookie: ", cookie);

          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    // logger: {
    //   error(code, metadata) {
    //     console.log({ type: "inside error logger", code, metadata });
    //   },
    //   warn(code) {
    //     console.log({ type: "inside warn logger", code });
    //   },
    //   debug(code, metadata) {
    //     console.log({ type: "inside debug logger", code, metadata });
    //   },
    // },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        authorization:
          "https://accounts.google.com/o/oauth2/auth?response_type=code&prompt=consent",
      }),
      CredentialsProvider({
        name: "credentials",
        credentials: {
          email: {
            label: "email",
            type: "text",
            placeholder: "jsmith@test.com",
          },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.username,
              },
            });
            await prisma.$disconnect();

            console.log("Authorize User Credentials: ", user);

            if (user && credentials.password == user.password) {
              userAccount = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
              };
              // console.log("UserAccount created: ", userAccount);
              return userAccount;
            } else {
              console.log("Hash not matched logging in");
              return null;
            }
          } catch (err) {
            console.log("Authorize error:", err);
          }
        },
      }),
    ],
    callbacks: callbacks,
  };

  return await NextAuth(req, res, options);
}

// CredentialsProvider({
//   name: "Credentials",
//   credentials: {
//     email: {
//       label: "email",
//       type: "text",
//       placeholder: "jsmith@test.com",
//     },
//     password: { label: "Password", type: "password" },
//   },
//   async authorize(credentials, req) {
//     const email: string = req?.body?.username;
//     const password = req?.body?.password;
//     const user = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });
//     // await prisma.$disconnect();

//     if (user) {
//       // Any object returned will be saved in `user` property of the JWT
//       return user;
//     } else {
//       // If you return null then an error will be displayed advising the user to check their details.
//       return null;

//       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//     }
//   },
// }),
