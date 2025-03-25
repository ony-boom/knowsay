import { supabase } from "@/lib/supabase";

const DATA = [
  {
    slug: "general-knowledge",
    name: "General Knowledge",
    description: "Test your knowledge on a wide variety of topics.",
  },
  {
    slug: "science",
    name: "Science",
    description:
      "Questions about physics, chemistry, biology and other scientific fields.",
  },
  {
    slug: "math",
    name: "Math",
    description:
      "Test your mathematical skills with various problems and equations.",
  },
  {
    slug: "history",
    name: "History",
    description:
      "Questions about important historical events, figures, and civilizations.",
  },
  {
    slug: "sports",
    name: "Sports",
    description:
      "Questions about various sports, athletes, and sporting events.",
  },
  {
    slug: "geography",
    name: "Geography",
    description:
      "Test your knowledge about countries, capitals, landmarks, and geographical features.",
  },
  {
    slug: "politics",
    name: "Politics",
    description:
      "Questions about political systems, governments, and international relations.",
  },
  {
    slug: "music",
    name: "Music",
    description:
      "Test your knowledge about musical artists, songs, instruments, and theory.",
  },
  {
    slug: "movies",
    name: "Movies",
    description:
      "Questions about films, directors, actors, and cinema history.",
  },
  {
    slug: "technology",
    name: "Technology",
    description:
      "Questions about gadgets, software, internet, and technological advancements.",
  },
  {
    slug: "art",
    name: "Art",
    description:
      "Test your knowledge about famous artworks, artists, and art movements.",
  },
  {
    slug: "literature",
    name: "Literature",
    description: "Questions about books, authors, literary works, and genres.",
  },
  {
    slug: "animals",
    name: "Animals",
    description:
      "Test your knowledge about different species, habitats, and animal facts.",
  },
  {
    slug: "food",
    name: "Food",
    description:
      "Questions about cuisine, ingredients, cooking techniques, and culinary traditions.",
  },
  {
    slug: "nature",
    name: "Nature",
    description:
      "Test your knowledge about plants, natural phenomena, and the environment.",
  },
  {
    slug: "programming",
    name: "Programming",
    description:
      "Questions about programming languages, development, and computer science.",
  },
];

export async function seedCategories() {
  const { data: existingCategories } = await supabase
    .from("categories")
    .select("slug");

  const existingSlugs = new Set(
    existingCategories?.map((cat) => cat.slug) || [],
  );

  const categoriesToInsert = DATA.filter(
    (category) => !existingSlugs.has(category.slug),
  );

  if (categoriesToInsert.length === 0) {
    console.log("All categories already exist, skipping seed");
    return [];
  }

  console.log(`Inserting ${categoriesToInsert.length} new categories...`);

  const insertPromises = categoriesToInsert.map((category) => {
    return supabase.from("categories").insert(category);
  });

  return Promise.all(insertPromises);
}
