const { User } = require('../../models/users');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const { v4 } = require('uuid');
const sendEmail= require('../../helpers/sendEmail')


const signup = async(req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({
            status: "conflict",
            code:409,
            data: {
              message: "Email in use"
              }
        })
    }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email)
  const verificationToken = v4()
  const result = await User.create({ email, password: hashPassword, avatarURL,verificationToken });
  const mail = {
    to: email,
    subject: "Confirm your email",
    html:`<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`
  }
  await sendEmail(mail)
    res.status(201).json({
        status: "created",
        code:201,

        data: {
    user: {
    email,
    subscription: result.subscription,
            avatarURL,
            verificationToken
  }
}
})

}

module.exports = signup