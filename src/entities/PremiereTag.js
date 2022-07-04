const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "premiere_tag",
  tableName: "premiere_tags",
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
