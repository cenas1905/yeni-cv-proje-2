'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteCVButtonProps {
  id: string;
}

export default function DeleteCVButton({ id }: DeleteCVButtonProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`CV silinirken hata oluştu: ${error.message}`);
      setLoading(false);
    } else {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(true)} 
        className="h-9 w-9 text-[#76777d] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 shrink-0 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-[#c6c6cd] bg-white text-[#0b1c30] max-w-sm rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-[#0b1c30] font-bold">CV'yi Sil</DialogTitle>
          <DialogDescription className="text-[#5c5d64] text-xs mt-1">
            Bu özgeçmişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setOpen(false)} 
            disabled={loading} 
            className="text-[#45464d] hover:bg-slate-50 border border-[#c6c6cd] font-semibold"
          >
            İptal
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete} 
            disabled={loading} 
            className="bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
          >
            {loading ? 'Siliniyor...' : 'Evet, Sil'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
