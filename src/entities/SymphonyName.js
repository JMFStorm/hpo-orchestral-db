const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "symphony_name",
  tableName: "symphony_names",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "uuid",
    },
    name: {
      type: "varchar",
    },
  },
});