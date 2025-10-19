import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Image } from "lucide-react";

interface ModeSelectorProps {
  mode: "description" | "images";
  onModeChange: (mode: "description" | "images") => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Select value={mode} onValueChange={onModeChange}>
      <SelectTrigger className="w-64 bg-zinc-900 border-zinc-700">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700">
        <SelectItem value="description" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Video from Description</span>
          </div>
        </SelectItem>
        <SelectItem value="images" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Video from Images</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
