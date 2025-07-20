import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";

interface BinCounts {
  Green: number;
  Blue: number;
  Brown: number;
  Yellow: number;
}

interface BinCounterProps {
  counts: BinCounts;
  onIncrement: (type: keyof BinCounts) => void;
  onDecrement: (type: keyof BinCounts) => void;
  onReset: () => void;
}

export default function BinCounter({ counts, onIncrement, onDecrement, onReset }: BinCounterProps) {
  const getBinTypeColor = (type: string) => {
    const colors = {
      Green: 'bg-green-500 hover:bg-green-600 border-green-300',
      Blue: 'bg-blue-500 hover:bg-blue-600 border-blue-300',
      Brown: 'bg-amber-600 hover:bg-amber-700 border-amber-300',
      Yellow: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-300',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTotalCount = () => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Bin Counter</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-lg px-3 py-1">
            Total: {getTotalCount()}
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-gray-600"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(counts) as Array<keyof BinCounts>).map((type) => (
          <Card key={type} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-4 h-4 ${getBinTypeColor(type).split(' ')[0]} rounded-full`}></div>
                  <span className="font-medium text-gray-700">{type}</span>
                </div>
                
                <div className="text-3xl font-bold text-gray-800">
                  {counts[type]}
                </div>
                
                <div className="flex justify-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDecrement(type)}
                    disabled={counts[type] === 0}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onIncrement(type)}
                    className={`w-16 h-8 text-white ${getBinTypeColor(type)}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {getTotalCount() > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">
                Street Survey Progress
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                {Object.entries(counts).map(([type, count]) => (
                  count > 0 && (
                    <div key={type} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 ${getBinTypeColor(type).split(' ')[0]} rounded-full`}></div>
                      <span className="text-blue-600">{type}: {count}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}