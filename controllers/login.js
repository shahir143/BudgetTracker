const User=require('../model/login');
const bcrypt=require('bcrypt');

exports.signup = async (req, res, next) => {
    try {
        const saltRounds = 10;
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, saltRounds);
        const existingUser = await User.findOne({ where: { userEmail: email } });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            userName: req.body.name,
            userEmail: email,
            userPassword: hash
        });
        console.log(user);
        return res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error in user signup:', error);
        res.status(500).json({ success: false, message: 'Error signing up user' });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { userEmail: email } });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.userPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password wrong' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ success: false, message: 'Error logging in user' });
    }
};




	