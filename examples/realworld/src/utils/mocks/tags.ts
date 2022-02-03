import { rest } from 'msw';

import type { TagsResponse } from '~/app/ports/tags';
import { db } from '~/utils/mocks/db';

export const getAllHandler = rest.get<never, TagsResponse>(
  `${import.meta.env.VITE_BACKEND_URL}/tags`,
  (_request, response, context) => {
    const tags = db.tag.getAll().map(({ name }) => name);

    return response(context.json({ tags }), context.delay());
  },
);
