const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "musician",
  tableName: "musicians",
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
