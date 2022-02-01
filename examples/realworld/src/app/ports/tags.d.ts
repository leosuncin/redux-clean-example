export type TagsResponse = {
  tags: string[];
};

export type TagsApi = {
  getAll(signal?: AbortSignal): Promise<string[]>;
};
