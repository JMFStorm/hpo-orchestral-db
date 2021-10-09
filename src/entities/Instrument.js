const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrument",
  tableName: "instruments",
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
