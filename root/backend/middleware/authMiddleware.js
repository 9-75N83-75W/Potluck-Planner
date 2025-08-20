// import jwt from "jsonwebtoken";

// const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; 

// // Generate JWT Token
// export const generateToken = (res, user) => {
//     const token = jwt.sign({id: user._id,  email: user.email }, SECRET_KEY, { expiresIn: "1h" });

//     res.cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//         sameSite: "Lax", // Ensure cookies work in local development
//         maxAge: 3600000 // 1 hour expiration
//     });

//     // Return the token string so the controller can send it in the JSON response
//     return token;

// };

// export const authenticateToken = (req, res, next) => {
//     console.log("hi cookie", req.cookies)
//     const token = req.cookies.jwt;
//     if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

//     try {
//         const decoded = jwt.verify(token, SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error("JWT Verification Error:", error.message);
//         return res.status(403).json({ message: "Invalid token" });
//     }





//     //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     //     console.log(err)
//     //     if (err) return res.sendStatus(403)
//     //     req.user = user
//     //     next()
//     //   })
//     // }
// };


// export const decodeToken = (token) => {
//   try {
//     return jwt.decode(token);
//   } catch {
//     return null;
//   }
// };

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

/**
 * Generates and sets a JWT as a cookie on the response.
 * @param {object} res The Express response object.
 * @param {object} user The user object (must contain _id and email).
 * @returns {string} The generated JWT token string.
 */
export const generateToken = (res, user) => {
    // Correctly sign the token with the user's ID and email.
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    // Set the token as a cookie on the response
    res.cookie("jwt", token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Lax", // Mitigates CSRF attacks
        maxAge: 3600000 // 1 hour expiration in milliseconds
    });
    
    // Return the token string so the controller can send it in the JSON response
    return token;
};

/**
 * Middleware to authenticate a token from the request headers.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 * @param {function} next The next middleware function.
 */
export const authenticateToken = (req, res, next) => {
    // First, check for the token in the Authorization header
    const authHeader = req.headers['authorization'];
    // The token is the part after "Bearer "
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        // If no token in header, check cookies (as a fallback)
        const cookieToken = req.cookies.jwt;
        if (!cookieToken) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        token = cookieToken;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // req.user will now contain both 'email' and 'id'
        req.user = decoded; 
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }
};

/**
 * Decodes a JWT token.
 * @param {string} token The JWT token to decode.
 * @returns {object|null} The decoded payload or null if an error occurs.
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};
