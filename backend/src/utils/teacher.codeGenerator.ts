export function generateCourseCode(name: string): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const prefix = name.replace(/\s+/g, '_').toUpperCase().slice(0, 10);
  return `${prefix}_${randomSuffix}`;
}