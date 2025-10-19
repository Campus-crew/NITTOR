"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface TextOverlayProps {
  open: boolean;
  onClose: () => void;
  onAdd: (text: TextOverlayData) => void;
}

export interface TextOverlayData {
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  position: { x: number; y: number };
  duration: number;
  startTime: number;
}

const FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Comic Sans MS",
];

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
];

export function TextOverlay({ open, onClose, onAdd }: TextOverlayProps) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [color, setColor] = useState("#ffffff");
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [duration, setDuration] = useState(5);

  const handleAdd = () => {
    if (!text.trim()) return;

    onAdd({
      content: text,
      fontSize,
      fontFamily,
      color,
      position: { x: positionX, y: positionY },
      duration,
      startTime: 0,
    });

    setText("");
    setFontSize(32);
    setFontFamily("Arial");
    setColor("#ffffff");
    setPositionX(50);
    setPositionY(50);
    setDuration(5);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-white">Add Text Overlay</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-zinc-300">
              Text Content
            </Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="bg-zinc-950 border-zinc-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font" className="text-zinc-300">
                Font
              </Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {FONTS.map((font) => (
                    <SelectItem key={font} value={font} className="text-white">
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-zinc-300">
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="bg-zinc-950 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  {COLORS.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className="text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-zinc-600"
                          style={{ backgroundColor: c.value }}
                        />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Font Size: {fontSize}px</Label>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              min={12}
              max={72}
              step={1}
              className="bg-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Duration: {duration}s</Label>
            <Slider
              value={[duration]}
              onValueChange={([value]) => setDuration(value)}
              min={1}
              max={30}
              step={0.5}
              className="bg-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Position X: {positionX}%</Label>
              <Slider
                value={[positionX]}
                onValueChange={([value]) => setPositionX(value)}
                min={0}
                max={100}
                step={1}
                className="bg-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Position Y: {positionY}%</Label>
              <Slider
                value={[positionY]}
                onValueChange={([value]) => setPositionY(value)}
                min={0}
                max={100}
                step={1}
                className="bg-zinc-800"
              />
            </div>
          </div>

          <div className="relative h-32 rounded border border-zinc-700 bg-zinc-950 overflow-hidden">
            <div
              className="absolute"
              style={{
                left: `${positionX}%`,
                top: `${positionY}%`,
                transform: "translate(-50%, -50%)",
                fontSize: `${fontSize * 0.3}px`,
                fontFamily,
                color,
                whiteSpace: "nowrap",
              }}
            >
              {text || "Preview"}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
