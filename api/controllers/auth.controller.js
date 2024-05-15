import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username: username, email: email, password: password });
    console.log(newUser);
    await newUser.save();
    res.status(201).json("User created successfully");
}