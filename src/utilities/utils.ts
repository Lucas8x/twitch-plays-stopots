export function isAValidUsername(string: string): boolean {
  return string.length >= 2 && string.length <= 15;
}

export function filterAnswers(letter: string, answers: ICategoryAnswers) {
  const finalAnswers = {};

  for (const [key, value] of Object.entries(answers)) {
    const sortedValues = value
      .filter((i) => i.value.startsWith(letter))
      .sort((a, b) => b.users.length - a.users.length);
    if (sortedValues.length === 0) continue;
    finalAnswers[key] = sortedValues[0].value;
  }

  return finalAnswers;
}
