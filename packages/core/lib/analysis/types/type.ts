export type TypeOpts<P extends object> = P & {
  name: string;
  supertypes: Array<Type<object>>;
};

export class Type<P extends object> {
  public static create<P extends object>(opts: TypeOpts<P>): Type<P> {
    return new Type<P>(opts.name, new Set(opts.supertypes), opts);
  }

  public static equals(a: Type<object>, b: Type<object>): boolean {
    return a === b;
  }

  public static isSuper(a: Type<object>, b: Type<object>): boolean {
    return b.supertypes.has(a);
  }

  public static isSub(a: Type<object>, b: Type<object>): boolean {
    return a.supertypes.has(b);
  }

  private constructor(
    public readonly name: string,
    public readonly supertypes: Set<Type<object>>,
    public readonly properties: P
  ) {}
}
