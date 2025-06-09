'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Menu, User, Heart, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AppBar() {
    const router = useRouter()
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('name');
      if (error) {
        console.error(error);
      } else {
        setCategories(data.map((c) => c.name));
      }
    }
    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 sm:h-16">
          
          {/* Mobile Menu Icon */}
          <button
            className="lg:hidden p-2 mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-xl font-bold">
            X
          </Link>

          {/* Categories - desktop */}
          <nav className="hidden lg:flex ml-8 space-x-2">
            {categories.map((cat) => (
              <Button key={cat} onClick={()=>{`/category/${cat}`}} variant={'ghost'} className="text-gray-700 text-[14px] hover:text-gray-900">
                {cat}
              </Button>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search - desktop */}
          <div className="hidden lg:block flex-shrink-0 w-1/3 max-w-xs">
            <Input placeholder="Search..." />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="ghost" className='flex flex-col gap-0' size="icon"><User /><p className='text-[9px]'>Profile</p></Button>
            <Button variant="ghost" className='flex flex-col gap-0' size="icon"><Heart /><p className='text-[9px]'>Wishlist </p></Button>
            <Button variant="ghost" className='flex flex-col gap-0' size="icon"><ShoppingBag /><p className='text-[9px]'>Cart</p></Button>
          </div>
        </div>

        {/* Mobile Menu & Search */}
        {mobileMenuOpen && (
            
          <div className="mt-1 pb-2 border-gray-200">
            {/* Mobile Categories */}
            <nav className="flex flex-wrap gap-2 space-y-2">
              {categories.map((cat) => (
                <Button key={cat} variant={'secondary'} onClick={()=>{router.push(`/category/${cat}`)}} className='w-min'>
                  {cat}
                </Button>
              ))}
            </nav>

            {/* Mobile Search */}
            
          </div>
        )}
        <div className="mt-1 px-2 mb-2 sm:display md:hidden">
              <Input placeholder="Search..." />
            </div>
      </div>
    </header>
  );
}
