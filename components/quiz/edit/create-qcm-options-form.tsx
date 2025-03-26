"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnswerItem } from "@/components/quiz/create/answer-item";
import { toast } from "sonner";
import {
  QCMOption,
  QCMOptionArray,
  storeQcmOptionSchema,
} from "@/schemas/qcmOptionSchema";
import { z } from "zod";
import {
  createQcmOptions,
  QcmOptionState,
} from "@/lib/actions/create-qcm-options";
import { useParams } from "next/navigation";
import { useActionState, useTransition } from "react";

const createOptionsSchema = z.object({
  options: z.array(storeQcmOptionSchema),
});

type CreateQcmOptionsFormProps = {
  qcm_id: string;
  questionId: string;
  initialData: QCMOptionArray;
};

export const CreateQcmOptionsForm = ({
  qcm_id,
  questionId,
  initialData,
}: CreateQcmOptionsFormProps) => {
  const params = useParams();
  const quizId = typeof params.id === "string" ? params.id : "";

  const [isPending, startTransition] = useTransition();
  const initialState: QcmOptionState = { message: undefined, errors: {} };

  const [options, setOptions] = useState<QCMOption[]>(initialData || []);
  const [newOption, setNewOption] = useState("");
  // Track whether options were modified from initial data
  const [optionsModified, setOptionsModified] = useState(false);
  // Track option changes by ID to know which ones are new or modified
  const [modifiedOptionIds, setModifiedOptionIds] = useState<Set<string>>(
    new Set(),
  );
  const [newOptionIds, setNewOptionIds] = useState<Set<string>>(new Set());

  // Create the server action with proper binding
  const createOptionsAction = createQcmOptions.bind(
    null,
    qcm_id,
    questionId,
    quizId,
  );
  const [state, formAction] = useActionState(createOptionsAction, initialState);

  // Load initial data when component mounts or when initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setOptions(initialData);
      setOptionsModified(false);
      // Reset tracking sets when new initial data is loaded
      setModifiedOptionIds(new Set());
      setNewOptionIds(new Set());
    }
  }, [initialData]);

  const addOption = () => {
    if (!newOption.trim()) {
      toast.error("Option text is required");
      return;
    }

    const newId = uuidv4();
    const newOptionItem: QCMOption = {
      option_id: newId,
      qcm_id,
      option_text: newOption,
      option_image_url: null,
      is_correct: false,
    };

    setOptions([...options, newOptionItem]);
    setNewOption("");
    setOptionsModified(true);

    // Track this as a new option
    setNewOptionIds((prev) => {
      const updated = new Set(prev);
      updated.add(newId);
      return updated;
    });
  };

  const updateOption = (updatedOption: QCMOption) => {
    setOptions(
      options.map((option) =>
        option.option_id === updatedOption.option_id ? updatedOption : option,
      ),
    );
    setOptionsModified(true);

    // If this isn't a new option, mark it as modified
    if (!newOptionIds.has(updatedOption.option_id)) {
      setModifiedOptionIds((prev) => {
        const updated = new Set(prev);
        updated.add(updatedOption.option_id);
        return updated;
      });
    }
  };

  const toggleCorrect = (id: string) => {
    setOptions(
      options.map((option) =>
        option.option_id === id
          ? { ...option, is_correct: !option.is_correct }
          : option,
      ),
    );
    setOptionsModified(true);

    // If this isn't a new option, mark it as modified
    if (!newOptionIds.has(id)) {
      setModifiedOptionIds((prev) => {
        const updated = new Set(prev);
        updated.add(id);
        return updated;
      });
    }
  };

  const deleteOption = (id: string) => {
    setOptions(options.filter((option) => option.option_id !== id));
    setOptionsModified(true);

    // Remove from tracking sets if it exists
    setModifiedOptionIds((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });

    setNewOptionIds((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const handleSubmit = () => {
    try {
      // Validate options with schema
      createOptionsSchema.parse({ options });

      if (options.length < 2) {
        toast.error("You need at least 2 options");
        return;
      }

      if (!options.some((option) => option.is_correct)) {
        toast.error("At least one option must be marked as correct");
        return;
      }

      startTransition(() => {
        // Create a FormData to submit
        const formData = new FormData();

        // Only submit options that are new or modified
        const optionsToSubmit = options.filter(
          (option) =>
            newOptionIds.has(option.option_id) ||
            modifiedOptionIds.has(option.option_id),
        );

        if (optionsToSubmit.length === 0) {
          toast.info("No changes to save");
          return;
        }

        // Add each option to the FormData with indexed fields
        optionsToSubmit.forEach((option, index) => {
          formData.append(`option_text_${index}`, option.option_text || "");
          formData.append(`option_id_${index}`, option.option_id);
          if (option.option_image_url) {
            formData.append(
              `option_image_url_${index}`,
              option.option_image_url,
            );
          }
          formData.append(
            `is_correct_${index}`,
            option.is_correct ? "true" : "false",
          );
          // Add a flag to indicate if this is a new option
          formData.append(
            `is_new_${index}`,
            newOptionIds.has(option.option_id) ? "true" : "false",
          );
        });

        // Submit the form using the server action
        formAction(formData);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to save options");
      }
    }
  };

  // Show toast on success or error
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Options saved successfully");
      // Reset tracking after successful save
      setModifiedOptionIds(new Set());
      setNewOptionIds(new Set());
      setOptionsModified(false);
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  // Check if the button should be enabled
  const isSaveButtonDisabled =
    isPending ||
    options.length < 2 ||
    !options.some((option) => option.is_correct) ||
    !optionsModified ||
    (newOptionIds.size === 0 && modifiedOptionIds.size === 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multiple Choice Options</CardTitle>
        <CardDescription>
          Create options for your multiple choice question. Mark at least one as
          correct.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="new-option">New Option</Label>
            <div className="flex gap-2">
              <Input
                id="new-option"
                placeholder="Enter an option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <Button type="button" onClick={addOption}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          <div className="text-muted-foreground text-sm">
            You need at least 2 options with at least 1 marked as correct.
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Options ({options.length})</h3>
          {options.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center">
              <p className="text-muted-foreground text-sm">
                No options added yet.
              </p>
              <p className="text-muted-foreground text-sm">
                Add your first option above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option, index) => (
                <AnswerItem
                  key={option.option_id}
                  answer={{
                    id: option.option_id,
                    text: option.option_text || "",
                    isCorrect: option.is_correct,
                  }}
                  index={index}
                  onEdit={(updatedAnswer) =>
                    updateOption({
                      ...option,
                      option_text: updatedAnswer.text,
                    })
                  }
                  onToggleCorrect={toggleCorrect}
                  onDelete={deleteOption}
                  isNew={newOptionIds.has(option.option_id)}
                  isModified={modifiedOptionIds.has(option.option_id)}
                />
              ))}
            </div>
          )}
        </div>

        {state?.errors?._form && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            <p className="font-medium">Error</p>
            <p>{state.errors._form.join(", ")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-muted-foreground text-sm">
          {modifiedOptionIds.size > 0 && (
            <span>{modifiedOptionIds.size} modified • </span>
          )}
          {newOptionIds.size > 0 && <span>{newOptionIds.size} new</span>}
        </div>
        <Button onClick={handleSubmit} disabled={isSaveButtonDisabled}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : state?.success ? "Saved" : "Save Options"}
        </Button>
      </CardFooter>
    </Card>
  );
};
