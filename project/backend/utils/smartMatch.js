const synonyms = {
  rice: ["rice", "chawal", "biryani", "pulao"],
  bread: ["bread", "roti", "chapati", "naan"],
  dal: ["dal", "lentils"],
  milk: ["milk", "doodh"],
  vegetable: ["sabzi", "vegetable", "veggies"]
};

// 🔥 expand keywords
export const expandKeywords = (input) => {
  const words = input.toLowerCase().split(" ");

  let expanded = [];

  words.forEach(word => {
    if (synonyms[word]) {
      expanded.push(...synonyms[word]);
    } else {
      expanded.push(word);
    }
  });

  return [...new Set(expanded)];
};

// 🔥 scoring system
export const calculateScore = (foodTitle, keywords) => {

  let score = 0;
  const title = foodTitle.toLowerCase();

  keywords.forEach(word => {
    if (title.includes(word)) {
      score += 1;
    }
  });

  return score;
};