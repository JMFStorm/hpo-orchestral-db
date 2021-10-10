const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrumentSession",
  tableName: "instrumentSessions",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
  },
  relations: {
    musician: {
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
