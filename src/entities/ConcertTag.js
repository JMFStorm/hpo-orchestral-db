const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "concert_tag",
  tableName: "concert_tags",
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
