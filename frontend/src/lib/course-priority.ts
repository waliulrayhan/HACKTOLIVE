type CourseLike = {
  title?: string | null;
};

const PRIORITY_COURSE_PATTERNS = [
  [
    'mastering in cybersecurity and penetration testing mcpt',
    'mastering in cybersecurity and penetration testing',
  ],
  [
    'professional soc analyst training program',
  ],
] as const;

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getPriorityRank = (title?: string | null): number => {
  if (!title) return Number.POSITIVE_INFINITY;

  const normalizedTitle = normalize(title);

  const matchIndex = PRIORITY_COURSE_PATTERNS.findIndex((keywords) =>
    keywords.some((keyword) => normalizedTitle.includes(normalize(keyword))),
  );

  return matchIndex === -1 ? Number.POSITIVE_INFINITY : matchIndex;
};

export const getCoursePrioritySerial = (title?: string | null): number | null => {
  const rank = getPriorityRank(title);
  if (!Number.isFinite(rank)) {
    return null;
  }
  return rank + 1;
};

export const prioritizeCourses = <T extends CourseLike>(courses: T[]): T[] => {
  return courses
    .map((course, index) => ({ course, index, rank: getPriorityRank(course.title) }))
    .sort((a, b) => {
      if (a.rank === b.rank) {
        return a.index - b.index;
      }
      return a.rank - b.rank;
    })
    .map((item) => item.course);
};
