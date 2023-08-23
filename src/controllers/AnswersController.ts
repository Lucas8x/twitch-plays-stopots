export class AnswersController {
  private answers: ICategoryAnswers = {};

  constructor() {}

  public getAnswers(): ICategoryAnswers {
    return this.answers;
  }

  public clearAnswers() {
    this.answers = {};
  }

  private categoryExists = (category: string) => !!this.answers[category];

  public addAnswer(category: string, answer: string, user: string) {
    try {
      if (!this.categoryExists(category)) {
        this.answers[category] = [
          {
            value: answer,
            users: [user],
          },
        ];
        return;
      }

      const categoryAnswers = this.answers[category];
      const existingAnswer = categoryAnswers.find(
        (item) => item.value === answer
      );

      if (existingAnswer) {
        if (!existingAnswer.users.includes(user)) {
          existingAnswer.users.push(user);
        }
      } else {
        categoryAnswers.push({ value: answer, users: [user] });
      }
    } catch (error) {}
  }
}
