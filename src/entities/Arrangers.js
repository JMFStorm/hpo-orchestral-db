const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "arrangers",
  tableName: "arrangers",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    names: {
      type: "varchar",
    },
  },
});
