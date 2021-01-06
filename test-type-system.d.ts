type TSNumber = number;

export type integer = {
  name: "int";
};

export type integer_literal = {
  name: "integer literal",
  forNodes: ["NumericLiteral"];
  supertypes: [integer];
};
