import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
            <h1 className="text-8xl md:text-9xl font-sans font-bold text-atlas-text-primary tracking-tighter">
                404
            </h1>
            
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-atlas-text-secondary sm:text-3xl">
                Page not found
            </h2>
            
            <p className="mt-4 text-sm text-atlas-text-muted max-w-[500px] leading-relaxed mx-auto">
                Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in the AI Atlas.
            </p>
            
            <div className="mt-10">
                <Link 
                    href="/"
                    className="inline-flex items-center justify-center rounded bg-atlas-blue/10 px-6 py-3 text-sm font-mono uppercase tracking-wider text-atlas-blue border border-atlas-blue/20 transition-all hover:bg-atlas-blue/20 hover:scale-105 focus:outline-none"
                >
                    ← Return to Home
                </Link>
            </div>
        </div>
    );
}