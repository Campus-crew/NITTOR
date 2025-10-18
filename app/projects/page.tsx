import Link from "next/link";

export default function ProjectsPage() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-normal hover:text-gray-300 transition-colors">
              nittor
            </Link>
            
            {/* Navigation link */}
            <Link 
              href="/projects" 
              className="text-gray-400 hover:text-lime-400 transition-colors font-medium"
            >
              Feed
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User avatar with profile link */}
            <Link 
              href="/profile"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 text-black text-sm font-bold hover:bg-lime-500 transition-colors"
            >
              S
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        {/* Hero section with video background */}
        <div className="relative mb-8 rounded-2xl overflow-hidden h-[400px]">
          {/* Video background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/a49c91df-0b6a-4526-8292-44b679fa6cd0.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-12">
            <div>
              <h2 className="text-5xl font-light mb-4">
                Explore projects from nittor experts
              </h2>
              <p className="text-xl text-white/80 mb-6">
                Inspiration for getting started in nittor
              </p>
              <Link href="/generate">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full backdrop-blur-sm transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                  </svg>
                  Add Starter Projects
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Video project card */}
          <Link href="/generate" className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative group cursor-pointer">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto"
            >
              <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/59b6e4cf-0881-47fb-b758-0b533e388c03.mp4" type="video/mp4" />
            </video>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-lime-400">
                <div className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-sm">Create project</span>
              </div>
            </div>
          </Link>
          
          {/* Create new project card with video background */}
          <Link href="/generate" className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative group cursor-pointer">
            {/* Video background */}
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto"
            >
              <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/6f270e67-9258-4dd5-817c-5da59fc549b3.mp4" type="video/mp4" />
            </video>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-lime-400">
                <div className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-sm">Create project</span>
              </div>
            </div>
          </Link>
          
          {/* Combined card with building and new video stacked */}
          <div className="flex flex-col gap-6">
            {/* Building video */}
            <Link href="/generate" className="bg-gray-900 rounded-xl h-64 border border-gray-800 overflow-hidden relative group cursor-pointer">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/aabb1d3d-0626-48d6-9c31-e019c4aff361.mp4" type="video/mp4" />
              </video>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-sm text-white/80">Jul 13 - 19:17</p>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-lime-400">
                  <div className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-sm">Create project</span>
                </div>
              </div>
            </Link>
            
            {/* New video */}
            <Link href="/generate" className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative group cursor-pointer">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto"
              >
                <source src="https://d3u0tzju9qaucj.cloudfront.net/bc7c962c-df80-4e8f-a0bb-a60a92385e32/84dd4bd8-c855-4192-86e1-0ae7281a5c63.mp4" type="video/mp4" />
              </video>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-lime-400">
                  <div className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                      <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="text-sm">Create project</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Date label below grid */}
        <div className="mt-8 text-sm text-gray-500">
          Oct 18 - 13:16
        </div>
      </main>
    </div>
  );
}
