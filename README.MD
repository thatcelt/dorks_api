# DorksAPI

DorksAPI is a RESTful API built with Fastify, Prisma, and Frida. It provides endpoints for generating digital signatures and managing user data.

## Table of Contents

* [Getting Started](#getting-started)
* [Endpoints](#endpoints)
* [Signature Generation](#signature-generation)
* [User Management](#user-management)
* [Frida Integration](#frida-integration)
* [Prisma Database](#prisma-database)
* [Dependencies](#dependencies)

## Getting Started

To get started with DorksAPI, follow these steps:

1. Clone the repository: `git clone https://github.com/thatcelt/dorks_api.git`
2. Install dependencies: `npm install` or `yarn install` and globally install `npm install typescript` or `yarn install typescript`
3. Start the server: `npm run` or `yarn run`

## Endpoints

### Signature Endpoints

* `GET /api/v1/signature/credentials/:userId` Get credentials to update public key
* `POST /api/v1/signature/hmac`: Generate an HMAC signature
* `POST /api/v1/signature/ecdsa`: Generate an ECDSA signature

### User Endpoints

* `GET /api/v1/users/get/:userId`: Get a user by ID
* `POST /api/v1/users/add`: Add a new user
* `POST /api/v1/users/setActivity/:isActive`: Set a user's activity status

## Signature Generation

DorksAPI uses Frida to generate digital signatures. The `signature.controller` module exports two functions: [generateHMAC] and [generateECDSA]. These functions take in a payload and optional user ID, and return a signature.

## User Management

DorksAPI uses Prisma to manage user data. The `user.controller` module exports three functions: `addUser`, `getUser`, and `setActivity`. These functions interact with the Prisma database to perform CRUD operations on user data.

## Frida Integration

DorksAPI uses Frida to generate digital signatures. The `resolveFrida` module exports a [loadFrida] function that loads the Frida script and sets up the API.

## Prisma Database

DorksAPI uses Prisma to manage user data. The `prisma` module exports a `PRISMA` client that interacts with the Prisma database.

## Dependencies

* `fastify`: Fastify framework
* `uuid` UUID system
* `prisma`: Prisma database
* `frida`: Frida framework
* `crypto-js`: CryptoJS library
* `dotenv`: Dotenv library

Note: This is just a draft, and you should update the README.md to reflect the actual functionality and features of your project.