export type CounterApi = {
  fetchCount(amount: number): Promise<{ data: number }>;
};
