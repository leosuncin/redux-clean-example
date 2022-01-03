export interface CounterApi {
  fetchCount(amount: number): Promise<{ data: number }>;
}
