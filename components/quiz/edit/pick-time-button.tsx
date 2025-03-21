"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Timer } from "lucide-react";
import React, { useState } from "react";
import { TimePicker } from "./time-picker";

type PickTimeButtonProps = {
  onChange: (date: Date | undefined) => void;
  date: Date | undefined;
};

const PickTimeButton = ({ onChange, date }: PickTimeButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(0, 0, 0, 0, 1, 0),
  ); // Default: 1 minute

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    onChange(newDate);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="hover:cursor-pointer" asChild>
        <Button size="icon" variant="ghost">
          <Timer className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Set Time Limit</h4>
            <p className="text-muted-foreground text-sm">
              Choose how long participants have to answer this question
            </p>
          </div>
          <div className="grid gap-2">
            <TimePicker date={selectedDate} setDate={handleDateChange} />
          </div>
          <div className="flex justify-end">
            <Button
              size="default"
              onClick={() => {
                setOpen(false);
                onChange(selectedDate);
                setSelectedDate(new Date(0, 0, 0, 0, 1, 0));
              }}
            >
              Apply Time Limit
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PickTimeButton;
