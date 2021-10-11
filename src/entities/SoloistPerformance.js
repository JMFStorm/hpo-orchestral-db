const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "soloist_performance",
  tableName: "soloist_performances",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
  },
  relations: {
    soloist: {
      target: "musician",
      type: "one-to-many",
      cascade: true,
    },
    instrument: {
      target: "instrument",
      type: "one-to-many",
      cascade: true,
    },
  },
});
