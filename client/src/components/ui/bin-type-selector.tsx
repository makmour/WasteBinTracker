import { Checkbox } from "@/components/ui/checkbox";

interface BinTypeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
}

export default function BinTypeSelector({ value, onChange, options }: BinTypeSelectorProps) {
  const getBinTypeColor = (type: string) => {
    const colors = {
      Green: 'bg-green-500',
      Blue: 'bg-blue-500',
      Brown: 'bg-amber-600',
      Yellow: 'bg-yellow-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      onChange([...value, type]);
    } else {
      onChange(value.filter(t => t !== type));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((type) => (
        <label
          key={type}
          className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Checkbox
            checked={value.includes(type)}
            onCheckedChange={(checked) => handleTypeChange(type, !!checked)}
          />
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 ${getBinTypeColor(type)} rounded-full`}></div>
            <span className="font-medium text-gray-700">{type}</span>
          </div>
        </label>
      ))}
    </div>
  );
}
