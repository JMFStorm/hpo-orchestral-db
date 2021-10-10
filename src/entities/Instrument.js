const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrument",
  tableName: "instruments",
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
