 /* import axios from "axios";
import validator from "validator";


export const isEmailFormatValid = (email) => {
    return validator.isEmail(email);
};


export const isRealEmail = async (email) => {
    try {
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`;

        const response = await axios.get(url);

        if (
            response.data.deliverability === "DELIVERABLE" &&
            response.data.is_smtp_valid?.value === true
        ) {
            return true;
        }

        return false;

    } catch (error) {
        console.log("Email API Error:", error.message);
        // If API fails → assume invalid email
        return false;
    }
};


export const isValidName = (name) => {
    return name && name.length >= 2;
};

export const isValidPassword = (password) => {
    return validator.isStrongPassword(password);
};
*/