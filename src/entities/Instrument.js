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
  relations: {
    soloist_performances: {
      target: "soloist_performance",
      type: "one-to-many",
      cascade: true,
    },
  },
});
