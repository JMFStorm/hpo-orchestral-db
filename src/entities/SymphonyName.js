const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "symphony_name",
  tableName: "symphony_names",
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
    symphony: {
      target: "symphony",
      type: "many-to-one",
      joinTable: true,
      cascade: true,
    },
  },
});
