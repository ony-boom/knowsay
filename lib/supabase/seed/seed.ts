import { seedQuizzes } from "./quizzes";

export async function seed() {
  try {
    // const categories = await seedCategories();
    const quizzes = await seedQuizzes();

    return {
      // categories,
      quizzes,
    };
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed()
  .then(() => {
    console.log("Data seeded successfully");
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
  });
