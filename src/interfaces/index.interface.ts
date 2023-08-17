interface Answer {
  value: string;
  users: string[];
}

interface CategoryAnswers {
  [category: string]: Answer[];
}
