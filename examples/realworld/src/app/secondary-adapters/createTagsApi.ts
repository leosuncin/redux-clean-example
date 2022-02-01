import type { KyInstance } from 'ky/distribution/types/ky';

import type { TagsApi, TagsResponse } from '~/app/ports/tags';

export type CreateTagApiParams = { client: KyInstance };

export function createTagsApi({ client }: CreateTagApiParams): TagsApi {
  return {
    async getAll(signal?: AbortSignal) {
      const { tags } = await client
        .get('tags', { signal })
        .json<TagsResponse>();

      return tags;
    },
  };
}
