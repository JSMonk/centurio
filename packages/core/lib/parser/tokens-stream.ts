import { Transform as TransformStream } from "stream";
import { UnknownLexemeError } from "../errors";
import type { Tokenizer } from "./tokenizer";
import type { TransformOptions, TransformCallback } from "stream";

export class TokensStream<TokenType> extends TransformStream {
  constructor(
    private tokenizer: Tokenizer<TokenType>,
    opts?: TransformOptions
  ) {
    super({ ...opts, readableObjectMode: true });
  }

  _transform(bytes: Buffer, _: BufferEncoding, push: TransformCallback): void {
    const lexeme = bytes.toString();
    const token = this.tokenizer.getTokenFor(lexeme);
    if (token === null) {
      push(new UnknownLexemeError(lexeme));
    } else {
      push(null, token);
    }
  }
}
