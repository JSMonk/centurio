export interface Parser<N> {
  getProgram(): Promise<N>
}
