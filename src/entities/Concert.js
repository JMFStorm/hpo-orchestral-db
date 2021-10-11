const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "concert",
  tableName: "concerts",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    concert_id: {
      type: "varchar",
    },
    date: {
      type: "date",
    },
    starting_time: {
      type: "time",
      nullable: true,
    },
  },
  relations: {
    location: {
      target: "location",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    orchestra: {
      target: "orchestra",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
    concert_tag: {
      target: "concert_tag",
      type: "many-to-one",
      cascade: true,
      onDelete: "CASCADE",
    },
  },
});
