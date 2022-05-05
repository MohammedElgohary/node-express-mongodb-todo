const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 4, maxLength: 35 },
    password: { type: "string", minLength: 8, maxLength: 35 },
  },
  required: ["username", "password"],
};

module.exports = ajv.compile(schema);
