const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

module.exports = {
  createUser: async args => {
    const { email, password } = args.userInput;

    try {
      const exisitingUser = await User.findOne({ email });
      if (exisitingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
      });
      const result = await newUser.save();

      return {
        ...result._doc,
        _id: result.id,
        password: null,
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt),
      };
    } catch (error) {
      throw error;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'supersecretkey',
      { expiresIn: '1h' }
    );
    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  }
};
