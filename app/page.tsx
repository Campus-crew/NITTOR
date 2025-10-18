import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background blur effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B4E031]/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#B4E031]/5 via-transparent to-transparent" />
      
      <main className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Logo/Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-12 w-12 text-[#B4E031]" />
            <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
              nittor
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Create videos with AI. Generate scenarios, frames and edit everything in one place.
          </p>
        </div>

        {/* CTA Button */}
        <Link href="/generate">
          <Button 
            size="lg" 
            className="mt-8 bg-[#B4E031] hover:bg-[#A0D020] text-black font-semibold px-8 py-6 text-lg rounded-full transition-all hover:scale-105"
          >
            Create Video
          </Button>
        </Link>

        {/* Feature hints */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">🎬</div>
            <h3 className="font-semibold text-white">Scenario Generation</h3>
            <p className="text-sm">AI creates a script based on your topic</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">🎨</div>
            <h3 className="font-semibold text-white">Frame Creation</h3>
            <p className="text-sm">Generate video from description or images</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="text-4xl">✂️</div>
            <h3 className="font-semibold text-white">Editing</h3>
            <p className="text-sm">Edit, cut, add audio</p>
          </div>
        </div>
      </main>
    </div>
  );
}
