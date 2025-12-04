export type BlogCategory = 
  | "Cybersecurity Insights" 
  | "News" 
  | "Tutorials";

export type BlogType = 
  | "Threat Alerts"
  | "How-to Tutorials"
  | "Best Security Practices"
  | "Compliance Guides"
  | "Case Study Stories";

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface Blog {
  _id: number | string;
  title: string;
  slug: string;
  mainImage: string;
  metadata: string;
  category: BlogCategory;
  blogType: BlogType;
  author: Author;
  publishDate: string;
  tags: string[];
  readTime?: string;
  content?: string;
  featured?: boolean;
}
