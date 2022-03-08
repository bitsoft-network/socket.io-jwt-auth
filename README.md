# socket.io-jwt-auth

Easy socket.io authentication using JWT.

## Usage

Install the package by typing `npm i @bitsoft-network/socket.io-jwt-auth` in your project folder. This module requires the socket.io clients to pass an JWT as auth headers when connecting. Read more about that [here](https://socket.io/docs/v4/client-options/#auth).

###### Example (client):

```javascript
import { io } from "socket.io-client";

const socket = io({
  auth: {
    token: "abcd",
  },
});

// or with a function
const socket = io({
  auth: cb => {
    cb({ token: localStorage.token });
  },
});
```

### Setup

###### Example (server):

```javascript
const socketAuthenticator = require("@bitsoft-network/socket.io-jwt-auth");

/* ... get access to socket.io's main object */
io.on(
  "connection",
  socketAuthenticator({ jwtSecret: process.env.JWT_SECRET }, socket => {
    // Example event handler
    socket.on("event", arg => {
      /* ...your code */
    });
  })
);
```

## Methods

### socketAuthenticator

Use this as an middleware to socket.io event. Example:

###### Example (server):

```javascript
io.on("connection", socketAuthenticator(authConfig, callback));
```

#### Parameters

- authConfig (ConfigObject)
- callback (Function)

#### Returns

None

### socketAuthenticator#callback

Callback function to pass socket object.

###### Added properties:

| Property           | Type    | Description                               | Extra                                |
| ------------------ | ------- | ----------------------------------------- | ------------------------------------ |
| `socket.loggedIn`  | Boolean | Describes user's authentication status    |                                      |
| `socket.authToken` | String  | User's provided JWT                       | Emitted if `socket.loggedIn = false` |
| `socket.user`      | Object  | Will contain the JSON data from the token | Emitted if `socket.loggedIn = false` |

###### Package code illustration:

```javascript
const callback = () => {
  return socket; // Socket.io default socket with added properties
};
```

#### Parameters

None

#### Returns

- Function

## Objects

### ConfigObject

Object which holds all configuration values for the middleware.

#### Example

```javascript
const config = {
  // Your JWT secret for signing tokens.
  // Read more about JWT here:
  // https://jwt.io/
  jwtSecret: "lamesecret",

  // Whether or not to emit auth events
  // to the client. Default: false
  disableEvents: false,
};
```

## Events

The middleware will emit a few events to the client automatically. You can disable this in the `ConfigObject`.

### authentication-error

When the authentication fails.

###### Example message:

```json
{
  "error": {
    "msg": "Token is not valid, authorization declined.",
    "loggedIn": false
  }
}
```

```json
{
  "error": {
    "msg": "No token provided, authorization declined.",
    "loggedIn": false
  }
}
```

### authentication-success

When authentication is successfull. User's decoded token is passed as well as socket's id (sid).

###### Example message:

```json
{
  "user": {
    // ...decoded token
  },
  "sid": "4nHsmuPpsGjnVI3HAAAA",
  "loggedIn": true
}
```

## License

MIT <3
