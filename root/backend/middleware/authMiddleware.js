import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; 

// Generate JWT Token
export const generateToken = (res, email) => {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // Use `true` in production
        sameSite: "Lax", // Ensure cookies work in local development
        maxAge: 3600000 // 1 hour expiration
    });

};

export const authenticateToken = (req, res, next) => {
    console.log("hi cookie", req.cookies)
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid token" });
    }





    //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     console.log(err)
    //     if (err) return res.sendStatus(403)
    //     req.user = user
    //     next()
    //   })
    // }
};


export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};
