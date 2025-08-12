const parseJSONFields = (req, res, next) => {
  const jsonFields = [
    "owner",
    "contact",
    "location",
    "business_hours",
    "features"
  ];
  
  jsonFields.forEach(field => {
    if (req.body[field]) {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        console.error(`Error parsing ${field}:`, err);
      }
    }
  });
  
  next();
};

module.exports = parseJSONFields;

