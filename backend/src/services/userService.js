require("dotenv").config();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            return {
                EC: 1,
                EM: "Email đã tồn tại, vui lòng chọn email khác"
            };
        }

        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds)
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        })
        return {
            EC: 0,
            data: result
        };

    } catch (error) {
        console.log(error);
        return { EC: -1, EM: error.message };
    }
}

const loginService = async (email1, password) => {
    try {
        //fetch user by email
        const user = await User.findOne({ email: email1 });
        if (user) {
            // Validation: Đảm bảo password từ request và password trong DB không bị undefined
            if (!password || !user.password) {
                return {
                    EC: 2,
                    EM: "Thiếu mật khẩu đầu vào"
                }
            }
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                //create an access token
                const payload = {
                    email: user.email,
                    name: user.name
                }

                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(">>> Lỗi catch login:", error.message);
        return { EC: -1, EM: "Lỗi tạo token hoặc DB: " + error.message };
    }
}

const getUserService = async () => {
    try {
        let result = await User.find({}).select("-password");
        return result;
    } catch (error) {
        console.log(error);
        return { EC: -1, EM: error.message };
    }
}

module.exports = {
    createUserService, loginService, getUserService
}