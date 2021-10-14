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
    order: {
      type: "int",
    },
    world_premiere: {
      type: "boolean",
      nullable: true,
    },
    premiere_in_finland: {
      type: "boolean",
      nullable: true,
    },
    premiere_in_europe: {
      type: "boolean",
      nullable: true,
    },
    premiere_dance_performance: {
      type: "boolean",
      nullable: true,
    },
    is_encore: {
      type: "boolean",
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
