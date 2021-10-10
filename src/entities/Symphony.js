const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "symphony",
  tableName: "symphonies",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    symphony_id: {
      type: "varchar",
    },
  },
  relations: {
    symphonyName: {
      target: "symphony_name",
      type: "one-to-many",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
