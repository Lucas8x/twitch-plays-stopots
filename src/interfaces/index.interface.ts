interface IAnswer {
  value: string;
  users: string[];
}

interface ICategoryAnswers {
  [category: string]: IAnswer[];
}
