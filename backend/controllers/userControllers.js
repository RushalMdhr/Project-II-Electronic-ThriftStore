import {User} from "../models/userModel.js";


const createUser = async (req, res) => {
    try {
        const { name } = req.body
        const user = await User.create({ name, role: 'customer', availableRoles: ['customer'] })
        res.status(201).json({
            message: "User created successfully",
            user
        })
    } catch (error) {
        console.error(error)
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        })
        console.error(error);
    }
}
const switchRole = async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.name });
        const role = req.body.role;
        console.log('found user')

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        if (!['customer', 'vendor', 'admin'].includes(role) | user.role === role) {
            console.error("invalid")
            return res.status(400).json({ error: 'Invalid role' });
        }
        if (user.availableRoles.includes(role)) {
            console.log('switching role')
            user.role = role;
        }
        else{
            return res.status(400).json({error: `not verified as ${role}` })
            
        }

        user.save();
        console.log(user)
        res.status(200).json({
            message: "User role updated successfully",
            user
        })
    } catch (error) {
        console.error(error);

    }
}

export { createUser, switchRole, getUser };