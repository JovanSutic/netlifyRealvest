const blogSectionTypes = ["title", "sub", "article", "media"] as const;
export type BlogSectionType = (typeof blogSectionTypes)[number];

export interface BlogSection {
  id?: string;
  type: BlogSectionType;
  content: string;
}

export interface Blog {
  id?: number;
  name: string;
  description: string;
  slug: string;
  media_link: string;
  date_created: Date;
  language: string;
}

export interface BlogContent {
  id?: number;
  type: BlogSectionType;
  sequence: number;
  content: string;
  blog_id: number;
}
