const Expense = require('../model/expense');

exports.saveData = async (req, res) => {
    
    try {
        const data = await Expense.create({
            Expenses: req.body.Expenses,
            Description: req.body.Description,
            Category: req.body.Category,
            userId: req.user.id,
        });
        res.status(201).json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Error in saving the data' });
    }
};

exports.deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        await Expense.destroy({ where: { id: id } });
        res.status(201).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};

exports.getData = async (req, res) => {
    console.log("req",req.user)
    try {
        console.log("userid=", req.user.id);
        const dbData = await Expense.findAll({ where: { userId: req.user.id } });
        const data = dbData.map(data => data.dataValues);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error in getting the data' });
    }
};
