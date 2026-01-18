import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ArrayInput({ label, values, onChange, disabled }) {
  const updateValue = (i, value) => {
    const copy = [...values];
    copy[i] = value;
    onChange(copy);
  };

  const removeValue = (i) => {
    onChange(values.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>

      {values.map((val, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={val}
            onChange={(e) => updateValue(i, e.target.value)}
            disabled={disabled}
            className="flex-1"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
          {!disabled && (
            <Button
              type="button" // CRITICAL FIX: Prevents form submission
              variant="outline"
              size="sm"
              className="px-3"
              onClick={() => removeValue(i)}
            >
              ✕
            </Button>
          )}
        </div>
      ))}

      {!disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1"
          onClick={() => onChange([...values, ""])}
        >
          + Add {label}
        </Button>
      )}
    </div>
  );
}