const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrument_session",
  tableName: "instrument_sessions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "uuid",
    },
  },
  relations: {
    musician: {
      target: "musician",
      type: "one-to-one",
      cascade: true,
    },
    instrument: {
      target: "instrument",
      type: "one-to-one",
      cascade: true,
    },
  },
});
