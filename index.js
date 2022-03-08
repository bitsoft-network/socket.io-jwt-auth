// Require dependencies
const jwt = require("jsonwebtoken");

// Main middleware function
const socketAuthenticator = ({ jwtSecret, disableEvents }, callback) => {
  // Return Interceptor
  return socket => {
    // Get token from handshake
    const token = socket.handshake.auth ? socket.handshake.auth.token : null;

    // Apply extra properties to socket instance
    socket.loggedIn = false;

    // If token was found
    if (token) {
      try {
        // Decode and verify JWT
        const decoded = jwt.verify(token, jwtSecret);

        // Apply extra properties to socket instance
        socket.authToken = token;
        socket.user = decoded.user;
        socket.loggedIn = true;

        // If events aren't disabled
        if (!disableEvents) {
          socket.emit("authentication-success", {
            user: decoded.user,
            sid: socket.id,
            loggedIn: true,
          });
        }

        // Continue and exit middleware
        callback(socket);
      } catch (error) {
        // If events aren't disabled
        if (!disableEvents) {
          // Display error message
          socket.emit("authentication-error", {
            error: {
              msg: "Token is not valid, authorization declined.",
              loggedIn: false,
            },
          });
        }

        // Continue and exit middleware
        callback(socket);
      }
    } else {
      // If events aren't disabled
      if (!disableEvents) {
        // Display error message
        socket.emit("authentication-error", {
          error: {
            msg: "No token provided, authorization declined.",
            loggedIn: false,
          },
        });
      }

      // Continue and exit middleware
      callback(socket);
    }
  };
};

// Export middleware
module.exports = socketAuthenticator;
