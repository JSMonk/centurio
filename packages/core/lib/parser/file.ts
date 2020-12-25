import { createReadStream } from "fs";
import type { ReadStream } from "fs";

export function readFile(path: string, encoding: BufferEncoding): ReadStream {
  return createReadStream(path, { 
    encoding,
    highWaterMark: 1,
  });
}
