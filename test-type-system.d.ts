type TSNumber = number;

export type integer = {
  name: "int";
};

export type integer_literal = {
  literal: true;
  nodes: ["NumericLiteral"];
  supertypes: [integer];
};
