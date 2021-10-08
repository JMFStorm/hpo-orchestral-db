const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "compositor", // Will use table name as default behaviour.
  tableName: "compositors", // Optional: Provide `tableName` property to override the default behaviour for table name.
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
