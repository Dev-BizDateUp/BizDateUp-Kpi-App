const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const prisma = require("../prisma/prismaClient.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}
async function signUp(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Missing username or password' });
  try {
    const existingUser = await prisma.credentials.findFirst({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ error: 'email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.credentials.create({
      data: {
        email: email,
        passhash: hashedPassword,
      },
    });

    const id = (await prisma.employees.findFirst({ where: { email: email } })).id;
    if (!id)
      return res.status(401).json({ error: 'User not found' });


    const token = generateToken({ id: id, email: newUser.email });
    res.cookie(
      'auth_token', token, {
      httpOnly: true,         // can't be accessed from JS
      secure: true,           // only over HTTPS
      sameSite: 'Strict',     // or 'Lax' or 'None' (for cross-site)
      maxAge: 24 * 60 * 60 * 1000 // 7 days
    }
    );
    return res.json({ token });
  } catch (err) {
    console.error('Sign up failed:', err);
    res.status(500).json({ error: 'Sign up failed', details: err.message });
  }
}
const loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Missing username or password' });

  try {
    const user = await prisma.credentials.findFirst({ where: { email: email } });

    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passhash);

    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' });
    const emp = await prisma.employees.findFirst({ where: { email: email } });
    if (!emp)
      return res.status(401).json({ error: 'Employee not found' });
    if (!emp.id)
      return res.status(401).json({ error: 'User not found' });
    const token = generateToken({
      id: emp.id,
      email: user.email,
    });
    res.cookie(
      'auth_token', token, {
      httpOnly: true,        
      secure: true,          
      sameSite: 'Strict',    
      maxAge: 24 * 60 * 60 * 1000 // 7 days
    }
    );
    return res.json({ token });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

const loginWithGoogle = async (req, res) => {
  const { credential } = req.body;

  if (!credential)
    return res.status(400).json({ error: 'Missing Google credential' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await prisma.employees.findFirst({ where: { email } });
    if (!user) {
      // Register new user if doesn't exist
      return res.status(409).json({ error: 'User not found', message: 'Please register first' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    console.log("Could not log in using google:", err)
    res.status(500).json({ error: 'Google login failed', details: err.message });
  }
};

module.exports = {
  loginWithUsername: loginWithEmail,
  loginWithGoogle,
  signUp
};
