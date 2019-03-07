const bcrypt = require('bcryptjs');

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

      const user = new User({
        email,
        password: hashedPassword,
      });
      const result = await user.save();

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
  }
};
