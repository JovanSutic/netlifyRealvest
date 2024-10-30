const blogSectionTypes = ["title", "sub", "article", "media", "link", "list"] as const;
export type BlogSectionType = (typeof blogSectionTypes)[number];

export interface BlogSection {
  id?: string;
  extra?: string;
  type: BlogSectionType;
  content: string;
}

export interface BlogContent {
  id?: number;
  extra: string;
  type: BlogSectionType;
  sequence: number;
  content: string;
  blog_id: number;
}

export interface Blog {
  id?: number;
  name: string;
  description: string;
  slug: string;
  media_link: string;
  date_created: Date | string;
  language: string;
  sections?: BlogContent[];
}
