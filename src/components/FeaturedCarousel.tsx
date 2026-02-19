import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BlogPost } from '@/lib/supabase';
import { BlogCard } from './BlogCard';
import { cn } from '@/lib/utils';

interface FeaturedCarouselProps {
    posts: BlogPost[];
}

export function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, [posts.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    }, [posts.length]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(handleNext, 5000);
        return () => clearInterval(timer);
    }, [handleNext, isPaused]);

    if (!posts.length) return null;

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="overflow-hidden rounded-xl border border-cyber-green/20 bg-cyber-black/40 backdrop-blur-sm">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {posts.map((post) => (
                        <div key={post.id} className="w-full flex-shrink-0 p-1">
                            <BlogCard post={post} featured />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {posts.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyber-black/60 border border-cyber-green/30 text-cyber-green opacity-0 group-hover:opacity-100 transition-all hover:bg-cyber-green hover:text-cyber-black z-30"
                        aria-label="Previous story"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyber-black/60 border border-cyber-green/30 text-cyber-green opacity-0 group-hover:opacity-100 transition-all hover:bg-cyber-green hover:text-cyber-black z-30"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {posts.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                currentIndex === index
                                    ? "bg-cyber-green w-6"
                                    : "bg-cyber-green/30 hover:bg-cyber-green/60"
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-cyber-green/10 blur-2xl -z-10 rounded-full opacity-50" />
        </div>
    );
}
