const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "musician",
  tableName: "musicians",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
    },
  },
});
