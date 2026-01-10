export const soloLevelingQuotes = [
  { quote: "I alone level up.", character: "Sung Jin-Woo" },
  { quote: "The difference between the novice and the master is that the master has failed more times than the novice has tried.", character: "Sung Jin-Woo" },
  { quote: "I will become strong enough to protect everyone.", character: "Sung Jin-Woo" },
  { quote: "The weak can never forgive. Forgiveness is the attribute of the strong.", character: "Sung Jin-Woo" },
  { quote: "Every trial endured and weathered in the right spirit makes a soul nobler and stronger.", character: "System" },
  { quote: "Rise from the ashes.", character: "Sung Jin-Woo" },
  { quote: "Only those who are willing to suffer greatly can achieve great things.", character: "System" },
  { quote: "The true hunter moves in silence.", character: "Sung Jin-Woo" },
  { quote: "Arise.", character: "Sung Jin-Woo" },
  { quote: "I don't need anyone's permission to get stronger.", character: "Sung Jin-Woo" },
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * soloLevelingQuotes.length);
  return soloLevelingQuotes[randomIndex];
};
