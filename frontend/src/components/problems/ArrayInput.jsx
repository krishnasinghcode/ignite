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
      <label className="font-medium">{label}</label>

      {values.map((val, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={val}
            onChange={(e) => updateValue(i, e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          {!disabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeValue(i)}
            >
              ✕
            </Button>
          )}
        </div>
      ))}

      {!disabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange([...values, ""])}
        >
          + Add
        </Button>
      )}
    </div>
  );
}
