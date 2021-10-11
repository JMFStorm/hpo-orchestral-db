const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "concert_performance",
  tableName: "concert_performances",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    order: {
      type: "int",
    },
  },
  relations: {
    concert: {
      target: "concert",
      type: "one-to-many",
      cascade: true,
    },
    symphony: {
      target: "symphony",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    conductor: {
      target: "musician",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    compositor: {
      target: "musician",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    arranger: {
      target: "musician",
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
  },
});
