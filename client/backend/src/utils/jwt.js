const jwt = require('jsonwebtoken');

// Generate access and refresh tokens
exports.generateTokens = (userId, accessTokenExpiry = '1d') => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

// Verify access token
exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Decode token without verification (for expired tokens)
exports.decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

// Generate a secure random token
exports.generateSecureToken = (length = 32) => {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
};

// Create JWT payload
exports.createTokenPayload = (user, includePermissions = false) => {
  const payload = {
    id: user._id,
    email: user.email,
    isEmailVerified: user.isEmailVerified
  };

  if (includePermissions) {
    // Add user permissions/roles if needed
    payload.permissions = ['take_test', 'view_results', 'update_profile'];
  }

  return payload;
};
