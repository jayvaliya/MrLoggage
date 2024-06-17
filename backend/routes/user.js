const { Router } = require('express');
const router = Router();
const userMiddleware = require('../middleware/user');
const { User, Todos } = require('../db/index');
const jwt = require('jsonwebtoken');
const { createTodo, updateTodo, login } = require('../types');
const jwtPassword = process.env.jwtPassword;

// NOTE:-   /signup and /login both routes should have password encryption logic.

router.post('/signup', async (req, res) => {
  try {
    const creatPayload = req.body;
    const parsedPayload = login.safeParse(creatPayload);
    if (!parsedPayload.success) {
      res.status(411).json({
        msg: 'Invalid inputes',
      });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(411).json({ msg: 'User alrady exist' });
    } else {
      await User.create({ email, password });
      const token = jwt.sign({email}, jwtPassword);
      res.json({ msg: 'User created successfully', token });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: 'Internal server error in signup', err});
  }
});

router.post('/login', async (req, res) => {
  try {
    const creatPayload = req.body;
    const parsedPayload = login.safeParse(creatPayload);
    if (!parsedPayload.success) {
      res.status(411).json({
        msg: 'Invalid inputes',
      });
      return;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({email}, jwtPassword);
      res.status(200).json({
        token: token,
        msg: 'Loged in successfully'
      });
      return;
    }
    res.status(411).json({ msg: 'Invalid email or password' });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ msg: 'Internal server error in login' });
  }
});

module.exports = router;