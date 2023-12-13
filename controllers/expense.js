const Expense = require('../model/expense');
const Sequelize= require('../util/database');
exports.saveIncome=async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user=req.user;
        console.log(req.body)
        const userincome=req.body.income;
        await user.update({income:userincome},t);
        await t.commit();
        res.status(201).json({ success: true, message:"updated"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error in saving the income' });
    }
};
exports.saveData = async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user=req.user;
        const data = await Expense.create({
            Expenses: req.body.Expenses,
            Description: req.body.Description,
            Category: req.body.Category,
            userId: req.user.id,
        });
        const totalExpenses=await Expense.sum('Expenses',{where:{userId: req.user.id},t});
        await user.update({totalexpenses:totalExpenses},t);

        await t.commit();
        res.status(201).json({ data });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error in saving the data' });
    }
};

exports.deleteData = async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user = req.user; 
        console.log("user", user);
        const id = req.params.id;
        await Expense.destroy({ where: { id: id } });

        const totalExpenses = await Expense.sum('Expenses', { where: { userId: user.id }, t });

        await user.update({ totalexpenses: totalExpenses }, { where: { id: user.id }, t });

        await t.commit();
        res.status(201).json({ message: 'Deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
};

exports.getData = async (req, res) => {
    console.log("req",req.user)
    try {
        const userLogin=req.user;
        const isPremium=req.user.premium
        const dbData = await Expense.findAll({ where: { userId: req.user.id } });
        const data = dbData.map(data => data.dataValues);
        
        res.status(201).json({ data: data, isPremium: isPremium ,userLogin:userLogin});
    } catch (error) {
        res.status(500).json({ error: 'Error in getting the data' });
    }
};
