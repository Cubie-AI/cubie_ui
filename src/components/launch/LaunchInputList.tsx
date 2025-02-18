import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface LaunchInputListProps {
  label: string;
  name: string;
  values: string[];
  dispatch: React.Dispatch<any>;
  placeholder?: string;
  disabled?: boolean;
}

export function LaunchInputList({
  label,
  name,
  values,
  dispatch,
  placeholder,
  disabled,
}: LaunchInputListProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) =>
                dispatch({
                  type: "update_array_item",
                  payload: {
                    name,
                    value: e.target.value,
                    index,
                  },
                })
              }
              placeholder={placeholder}
              disabled={disabled}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                dispatch({
                  type: "remove_array_item",
                  payload: {
                    name,
                    index,
                  },
                })
              }
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() =>
            dispatch({
              type: "add_array_item",
              payload: {
                name,
                value: "",
              },
            })
          }
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Add {label}
        </Button>
      </div>
    </div>
  );
}
