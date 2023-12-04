const User=require('../model/login');

exports.signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ userEmail: email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            userName: req.body.name,
            userEmail: req.body.email,
            userPassword: req.body.password
        });
        console.log(user);
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error in user signup:', error);
        res.status(500).json({ success: false, message: 'Error signing up user' });
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ userEmail: email });
        console.log(existingUser)
        if (existingUser) {
            if (existingUser.dataValues.userPassword === password && existingUser.dataValues.userEmail===email) {
                return res.status(201).json({ success: true, message: 'Login successful' });
            }else if (existingUser.dataValues.userEmail!==email){
                return res.status(401).json({ success: false, message: 'email Wrong' });
            }else if(existingUser.dataValues.userPassword !== password){
                return res.status(401).json({ success: false, message: 'Password Wrong' });
            }
        }else{
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ success: false, message: 'Error logging in user' });
    }
}



	