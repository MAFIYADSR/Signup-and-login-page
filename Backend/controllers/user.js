const User = require('../modules/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringNotValid(string) {
    if (string === undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

//To call signup route from postman enter
// ' http://localhost:3000/user/signup'
// const signup = async (req, res) =>{
//     try {
//         const { name, email, password } = req.body;
//         if (isStringNotValid(name) || isStringNotValid(email) || isStringNotValid(password)) {
//             return res.status(400).json({ err: "Bad parameters" });
//         }
//         const saltRounds = 10;
//         bcrypt.hash(password, saltRounds, async (err, hash) => {
//             await User.create({ name, email, password: hash });
//             res.status(201).json({ message: "Account successfully created" });

//         })
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json({ error: "internal server error" })
//     }
// }

const signup = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        // Validate input
        if (isStringNotValid(name) || isStringNotValid(email) || isStringNotValid(password)) {
            return res.status(400).json({ success: false, message: "Bad parameters. Name, email, or password is missing." });
        }

        const saltRounds = 10;

        // Hash password
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error("Hashing error:", err);
                return res.status(500).json({ success: false, message: "Something went wrong while hashing the password" });
            }

            try {
                await User.create({ name, email, password: hash });
                return res.status(201).json({ success: true, message: "Account successfully created" });
            } catch (dbError) {
                console.error("Database error:", dbError);
                return res.status(500).json({ success: false, message: "User creation failed" });
            }
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, 'secretcode')
}


//To call login route from postman enter
// 'http://localhost:3000/user/login'
// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findAll({ where: { email } });

//         if (user.length > 0) {
//             bcrypt.compare(password, user[0].password, (err, result) => {
//                 if (err) {
//                     res.status(500).json({ success: false, message: "Something went wrong" });

//                 }
//                 if (result == true) {
//                     res.status(200).json({ success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name) }, );

//                 }
//                 else {
//                     return res.status(400).json({ success: false, message: "Password is incorrect" });

//                 }
//             })
//         }
//         else {
//             console.log("User not found");
//             return res.status(404).json({ success: false, message: "User not found" });

//         }
//     }
//     catch (error) {
//         console.error("Login error: ", error);
//         res.status(500).json({ message: "Internal server error", success: false });

//     }
// }

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(stringValidOrNot(email) || stringValidOrNot(password)){
            return res.status(400).json({success: false, message: "Bad parameters, email or password is missing"})
        }

        const user = await User.findOne({ where: { email } }); // Use findOne instead of findAll

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Bcrypt compare error:", err);
                return res.status(500).json({ success: false, message: "Something went wrong" });
            }

            if (result === true) {
                const token = generateAccessToken(user.id, user.name);
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    token
                });
            }

            return res.status(401).json({ success: false, message: "Password is incorrect" }); // 401 Unauthorized is more appropriate
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = {
    signup,
    login,
    generateAccessToken
}