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
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    instrument: {
      target: "instrument",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    concert_performance: {
      target: "symphony_performance",
      type: "many-to-many",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
