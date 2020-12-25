import { Observer } from "../util/observer";
import { Writable as WriteStream } from "stream";
import type { AstBuilder } from "./ast-builder";
import type { WritableOptions } from "stream";

export class AstStream<TokenType, ASTNodeType> extends WriteStream {
  private program: ASTNodeType | null = null;
  private observer: Observer<ASTNodeType, Error> = new Observer();

  constructor(
    private astBuilder: AstBuilder<TokenType, ASTNodeType>,
    opts?: WritableOptions
  ) {
    super({ ...opts, objectMode: true });
  }

  _write(
    token: TokenType,
    _: BufferEncoding,
    fallback: (error?: Error | null) => void
  ): void {
    try {
      const isConsumed = this.astBuilder.consumeToken(token);
      fallback(null);
      if (!isConsumed) {
        super.end();
      } 
    } catch(e) {
      this.observer.notifyError(e);
      fallback(e);
    }
  }
  
  _final(fallback: (error?: Error | null) => void): void {
    try {
      this.program = this.astBuilder.getFullAST();
      this.observer.notifySuccess(this.program);
      fallback(null);
    } catch(e) {
      this.observer.notifyError(e);
      fallback(e);
    }       
  }

  getProgram(): Promise<ASTNodeType> {
    return new Promise((resolve, reject) => {
      this.observer.subscribe([resolve, reject]);
    });
  }
}
