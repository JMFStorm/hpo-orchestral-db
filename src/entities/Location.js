const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "location",
  tableName: "locations",
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
});
