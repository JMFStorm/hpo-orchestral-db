const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "symphony_performance",
  tableName: "symphony_performances",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    order: {
      type: "int",
    },
    footnote: {
      type: "varchar",
      nullable: true,
    },
    archive_info: {
      type: "varchar",
      nullable: true,
    },
  },
  relations: {
    concert: {
      target: "concert",
      type: "many-to-one",
      cascade: true,
    },
    symphony: {
      target: "symphony",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    conductors: {
      target: "musician",
      type: "many-to-many",
      cascade: true,
      onDelete: "CASCADE",
      joinTable: true,
    },
    compositors: {
      target: "musician",
      type: "many-to-many",
      cascade: true,
      onDelete: "CASCADE",
      joinTable: true,
    },
    arrangers: {
      target: "arrangers",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    soloist_performances: {
      target: "soloist_performance",
      type: "many-to-many",
      cascade: true,
      onDelete: "CASCADE",
      joinTable: true,
    },
    premiere_tag: {
      target: "premiere_tag",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
