const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrument_session",
  tableName: "instrument_sessions",
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
