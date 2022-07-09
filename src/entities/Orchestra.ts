const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "orchestra",
  tableName: "orchestries",
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
