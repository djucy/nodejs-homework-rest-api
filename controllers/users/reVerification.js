const { User } = require('../../models/users');
const sendEmail= require('../../helpers/sendEmail')


const reVerification = async (req, res) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (user.verify) {
        res.status(400).json({
        
                message: 'Verification has already been passed',
            
        })
        
    }
  
    
    // await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    const mail = {
    to: email,
    subject: "Confirm your email",
    html:`<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Confirm your email</a>`
  }
  await sendEmail(mail)
    res.status(200).json({
       
        message: "Verification email sent",
      
        
       
    })
    

}

module.exports = reVerification