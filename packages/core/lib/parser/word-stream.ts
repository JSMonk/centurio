import { Transform as TransformStream } from "stream";
import type { Matcher } from "./matcher";
import type { TransformOptions } from "stream";

export class WordStream extends TransformStream {
  private charBuffer: Array<String> = [];

  constructor(
    private skipChar: Matcher,
    private delimiter: Matcher,
    opts?: TransformOptions
  ) {
    super(opts);
  }

  _write(
    byte: Buffer,
    _: BufferEncoding,
    fallback: (error?: Error | null) => void
  ) {
    const char = byte.toString();
    const shouldBeSkipped = this.skipChar.test(char);
    if (shouldBeSkipped || this.delimiter.test(char)) {
      this.push(this.charBuffer.join(""));
      this.charBuffer = [];
      if (!shouldBeSkipped) {
        this.push(char);
      }
    } else {
      this.charBuffer.push(char);
    }
    fallback();
  }
}
