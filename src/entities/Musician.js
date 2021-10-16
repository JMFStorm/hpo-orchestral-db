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
  relations: {
    soloist_performances: {
      target: "soloist_performance",
      type: "one-to-many",
      cascade: true,
    },
    concert_performance: {
      target: "concert_performance",
      type: "one-to-many",
      cascade: true,
    },
  },
});
