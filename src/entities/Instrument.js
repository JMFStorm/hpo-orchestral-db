const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "instrument", // Will use table name as default behaviour.
  tableName: "instruments", // Optional: Provide `tableName` property to override the default behaviour for table name.
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
  },
});
