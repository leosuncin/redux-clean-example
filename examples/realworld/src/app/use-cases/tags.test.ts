import { setupServer } from 'msw/node';

import {
  reducer,
  initialState,
  thunks,
  type TagsSliceState,
} from '~/app/use-cases/tags';
import { createTagsApi } from '~/app/secondary-adapters/createTagsApi';
import { client } from '~/utils/client';
import { getAllHandler } from '~/utils/mocks/tags';

const server = setupServer(getAllHandler);

describe('Tags reducer', () => {
  const tagsApi = createTagsApi({ client });

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should get the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle the fetching all the tags', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.getAll();

    await thunk(dispatch, () => ({ tags: initialState }), { tags: tagsApi });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.getAll.pending.match(pendingAction)).toBe(true);
    expect(thunks.getAll.fulfilled.match(fulfilledAction)).toBe(true);

    const pendingState = reducer(initialState, pendingAction);

    expect(pendingState).toMatchObject<TagsSliceState>({
      status: 'pending',
      list: [],
    });

    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(fulfilledState).toMatchObject<TagsSliceState>({
      status: 'fulfilled',
      list: fulfilledAction.payload,
    });
  });
});
