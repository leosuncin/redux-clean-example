import { createCounter } from '../secondary-adapters/createCounter';
import { type CounterState, initialState, reducer, thunks } from './counter';

describe('counter reducer', () => {
  const extraArgument = { counterApi: createCounter() };

  it('should get the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      status: 'idle',
    });
  });

  it('should handle the increment of the value', () => {
    const dispatch = vi.fn();
    const thunk = thunks.increment();

    thunk(dispatch, () => ({ counter: initialState }), extraArgument);

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[incrementAction]] = dispatch.mock.calls;
    const actual = reducer(initialState, incrementAction);

    expect(actual.value).toEqual(1);
  });

  it('should handle the decrement of the value', () => {
    const dispatch = vi.fn();
    const thunk = thunks.decrement();

    thunk(dispatch, () => ({ counter: initialState }), extraArgument);

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[decrementAction]] = dispatch.mock.calls;
    const actual = reducer(initialState, decrementAction);

    expect(actual.value).toEqual(-1);
  });

  it('should handle the increment of the value by amount', () => {
    const dispatch = vi.fn();
    const thunk = thunks.incrementByAmount(2);

    thunk(dispatch, () => ({ counter: initialState }), extraArgument);

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[incrementByAmountAction]] = dispatch.mock.calls;
    const actual = reducer(initialState, incrementByAmountAction);

    expect(actual.value).toEqual(2);
  });

  it("should handle the increment of the value on when it's odd", () => {
    const dispatch = vi.fn();

    thunks.incrementIfOdd(2)(
      dispatch,
      () => ({ counter: initialState }),
      extraArgument
    );

    expect(dispatch).not.toHaveBeenCalled();

    thunks.incrementIfOdd(2)(
      dispatch,
      () => ({
        counter: {
          value: 3,
          status: 'idle',
        },
      }),
      extraArgument
    );

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[incrementIfOddAction]] = dispatch.mock.calls;

    expect(dispatch).toHaveBeenCalledWith(incrementIfOddAction);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('should handle the increment of the value by amount asynchronously', async () => {
    const dispatch = vi.fn();
    const getState = () => ({
      counter: initialState,
    });
    const thunk = thunks.incrementAsync(2);

    await thunk(dispatch, getState, extraArgument);

    expect(dispatch).toBeCalledTimes(2);

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;
    const pendingState = reducer(initialState, pendingAction);

    expect(pendingState).toMatchObject<CounterState>({
      status: 'loading',
      value: 0,
    });

    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(fulfilledState).toMatchObject<CounterState>({
      status: 'idle',
      value: 2,
    });
  });
});
