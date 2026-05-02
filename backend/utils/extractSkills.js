export const extractSkills = (text = "") => {
  const skillsList = [
    "react","node","node.js","express","mongodb","nosql",
    "javascript","js","html","css","java","spring",
    "python","django","flask","sql","mysql","postgres"
  ];

  const normalized = text.toLowerCase();

  // simple synonym normalization
  const synonyms = {
    "node.js": "node",
    "js": "javascript",
    "nosql": "mongodb"
  };

  const found = skillsList.filter(skill => normalized.includes(skill));

  // map synonyms to canonical names
  const canonical = found.map(s => synonyms[s] || s);

  // unique
  return [...new Set(canonical)];
};