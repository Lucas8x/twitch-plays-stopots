export function isAValidUsername(string: string): boolean {
  return string.length >= 2 && string.length <= 15;
}

export function filterAnswers(letter: string, answers: ICategoryAnswers) {
  if (!letter) return {};
  letter = letter.trim().toLowerCase();

  const finalAnswers = {};

  for (const [key, value] of Object.entries(answers)) {
    const sortedValues = value
      .filter((i) => i.value.toLowerCase().startsWith(letter))
      .sort((a, b) => b.users.length - a.users.length);
    if (sortedValues.length === 0) continue;
    finalAnswers[key] = sortedValues[0].value;
  }

  return finalAnswers;
}

export function normalizeCategory(category: string) {
  return category.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
