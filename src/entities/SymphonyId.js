const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "symphony_id",
  tableName: "symphony_ids",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "uuid",
    },
    symphony_id: {
      type: "varchar",
    },
  },
});
