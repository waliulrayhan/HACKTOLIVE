export type BlogCategory =
  | "Cybersecurity Basics"
  | "Ethical Hacking"
  | "Penetration Testing"
  | "Kali Linux & Linux Security"
  | "Cybersecurity Tools"
  | "Networking & Network Security"
  | "Web Application Security"
  | "Mobile Security"
  | "Cloud Security"
  | "Digital Forensics"
  | "Cyber Threats & Attacks"
  | "Malware & Ransomware"
  | "Privacy & Online Safety"
  | "Cryptography"
  | "Programming for Cybersecurity"
  | "Incident Response & SOC"
  | "Red Teaming"
  | "Blue Teaming"
  | "Security Certifications"
  | "Career Guides"
  | "Cybersecurity News & Updates"
  | "Vulnerabilities & Exploits"
  | "Security Best Practices"
  | "OSINT (Open-Source Intelligence)"
  | "IoT Security"
  | "AI in Cybersecurity"
  | "Cloud & DevSecOps"
  | "Security Tools Tutorials"
  | "CTF Walkthroughs & Labs"
  | "Guides & Step-by-Step Tutorials"
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
