import { readFile } from "./packages/core/lib/parser/file";
import { AstStream } from "./packages/core/lib/parser/ast-stream";
import { WordStream } from "./packages/core/lib/parser/word-stream";
import { TokensStream } from "./packages/core/lib/parser/tokens-stream";
import { GuuTokenizer } from "./packages/core/guu-example/guu-tokenizer";
import { GuuAstBuilder } from "./packages/core/guu-example/ast-builder";

(async () => {
  const program = await readFile("./test.guu", "utf8")
    .pipe(new WordStream(/[\s\t\n]/, /:/))
    .pipe(new TokensStream(new GuuTokenizer()))
    .pipe(new AstStream(new GuuAstBuilder()))
    .getProgram();

  console.log(JSON.stringify(program, null, 2));
})();
