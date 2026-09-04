const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const isValidEmail = (email) => {
    return typeof email === "string" && EMAIL_REGEX.test(email.trim());
};

export const isValidPassword = (password) => {
    return typeof password === "string" && password.trim().length >= MIN_PASSWORD_LENGTH;
};

export const isNonEmptyString = (value) => {
    return typeof value === "string" && value.trim().length > 0;
};

export const isValidId = (id) => {
    return /^\d+$/.test(String(id));
};

export const validateRegisterInput = ({ firstname, lastname, email, password }) => {
    const errors = [];
    if (!isNonEmptyString(firstname)) errors.push("firstname is required");
    if (!isNonEmptyString(lastname)) errors.push("lastname is required");
    if (!isNonEmptyString(email)) {
        errors.push("email is required");
    } else if (!isValidEmail(email)) {
        errors.push("email must be a valid email address");
    }
    if (!isNonEmptyString(password)) {
        errors.push("password is required");
    } else if (!isValidPassword(password)) {
        errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }
    return errors;
};

export const validateLoginInput = ({ email, password }) => {
    const errors = [];
    if (!isNonEmptyString(email)) errors.push("email is required");
    if (!isNonEmptyString(password)) errors.push("password is required");
    return errors;
};

export const validateForgotPasswordInput = ({ email }) => {
    const errors = [];
    if (!isNonEmptyString(email)) {
        errors.push("email is required");
    } else if (!isValidEmail(email)) {
        errors.push("email must be a valid email address");
    }
    return errors;
};

export const validateResetPasswordInput = ({ password }) => {
    const errors = [];
    if (!isNonEmptyString(password)) {
        errors.push("password is required");
    } else if (!isValidPassword(password)) {
        errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
    }
    return errors;
};

export const validateBlogInput = ({ blogTitle, blog }) => {
    const errors = [];
    if (!isNonEmptyString(blogTitle)) errors.push("blogTitle is required");
    if (!isNonEmptyString(blog)) errors.push("blog content is required");
    return errors;
};
