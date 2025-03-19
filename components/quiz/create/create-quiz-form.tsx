export const CreateQuizForm = () => {
  return (
    <form className="mt-8 space-y-8">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Quiz Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Enter your quiz title"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-muted-foreground text-sm">
              Choose a catchy title for your quiz that describes its content.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              placeholder="e.g., Science, History, Pop Culture"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-muted-foreground text-sm">
              Select a category that best fits your quiz content.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="difficulty"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled selected>
                Select difficulty
              </option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <p className="text-muted-foreground text-sm">
              Choose how challenging your quiz will be for participants.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide details about what your quiz covers..."
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
          <p className="text-muted-foreground text-sm">
            Give potential quiz takers an idea of what to expect.
          </p>
        </div>

        <div className="flex flex-row items-start space-x-3 rounded-md border p-4">
          <input
            type="checkbox"
            id="is_public"
            name="is_public"
            className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300 focus:ring-2"
          />
          <div className="space-y-1 leading-none">
            <label
              htmlFor="is_public"
              className="text-sm leading-none font-medium"
            >
              Public Quiz
            </label>
            <p className="text-muted-foreground text-sm">
              Make your quiz available for everyone to discover and play.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </form>
  );
};
