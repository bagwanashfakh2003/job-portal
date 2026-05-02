export const calculateMatch = (userSkills = [], jobSkills = []) => {
  const skillMap = {
    node: ["express", "backend"],
    react: ["frontend", "javascript"],
    mongodb: ["nosql", "database"],
  };

  const user = userSkills.map(s => s.toLowerCase());
  const job = jobSkills.map(s => s.toLowerCase());

  let exact = 0;
  let similar = 0;

  job.forEach(skill => {
    if (user.includes(skill)) {
      exact++;
    } else {
      const related = skillMap[skill] || [];
      if (related.some(r => user.includes(r))) {
        similar++;
      }
    }
  });

  if (job.length === 0) return 0;

  const score =
    (exact / job.length) * 100 +
    (similar / job.length) * 50;

  return Math.min(Math.round(score), 100);
};