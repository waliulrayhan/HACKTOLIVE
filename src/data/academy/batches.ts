// Batches are now integrated into courses as live delivery mode
// Live classes are courses with deliveryMode: "live"
// Import courses and filter by deliveryMode to get live classes

import { courses } from "./courses";

// Get live courses (previously known as batches)
export const liveCourses = courses.filter((c) => c.deliveryMode === "live");

// Backward compatibility - empty array
export const batches: any[] = [];
