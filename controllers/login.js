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


	