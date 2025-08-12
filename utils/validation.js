const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

const validateRequired = (fields, body) => {
  const missing = fields.filter(field => !body[field]);
  return missing.length === 0 ? null : missing;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired
};
