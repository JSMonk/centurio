type TSNumber = number;

export type integer = {
  name: "integer";
};

export type integer_literal = {
  literal: true;
  typeof: "number";
  name: "integer literal";
  supertypes: [integer];
};
