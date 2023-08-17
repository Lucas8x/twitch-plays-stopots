interface Answer {
  amount: number;
  value: string;
  users: string[];
}

interface CategoryAnswers {
  [category: string]: Answer;
}
