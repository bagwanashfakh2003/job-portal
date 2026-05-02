import jwt from "jsonwebtoken";

//  STRICT AUTH (use for protected routes)
export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId;

    next();

  } catch (error) {
    console.log("Auth Error:", error);
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};


//  OPTIONAL AUTH (use for public routes)
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.id = null; //  important
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId;

    next();

  } catch (error) {
    console.log("Optional Auth Error:", error);
    req.id = null; //  fallback
    next();
  }
};