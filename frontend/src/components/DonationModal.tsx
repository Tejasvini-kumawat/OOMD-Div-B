import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation } from '@/api';

interface DonationModalProps {
  ngo: any;
  open: boolean;
  onClose: () => void;
}

export function DonationModal({ ngo, open, onClose }: DonationModalProps) {

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState<File[]>([]);


  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('userId');

  // ✅ React Query mutation for donation creation
  const donationMutation = useMutation({
    mutationFn: createDonation,
    onSuccess: async () => {
      toast({
        title: 'Donation submitted!',
        description: `Your donation to ${ngo.name} has been submitted successfully.`,
      });

      await queryClient.invalidateQueries({ queryKey: ['userDonations', userId] });
      await queryClient.refetchQueries({ queryKey: ['userDonations', userId] });
      

      setItemName('');
      setDescription('');
      setAddress('');
      setImages([]);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Submission failed',
        description: error.response?.data?.message || 'Try again later',
        variant: 'destructive',
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 10) {
      toast({
        title: 'Limit Exceeded',
        description: 'You can upload up to 10 images only.',
        variant: 'destructive',
      });
      return;
    }
    setImages((prev) => [...prev, ...selectedFiles]);
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user._id || !ngo) return;
    if (!itemName) {
      toast({ title: 'Please select an item', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('ngoId', ngo._id);
    formData.append('userName', user.name);
    formData.append('userEmail', user.email);
    formData.append('userPhoneNumber', user.phoneNumber)
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('userAddress', address);
    images.forEach((img) => formData.append('images', img));
    // if (file) formData.append('pdf', file);

    donationMutation.mutate(formData);
  };


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Donate to {ngo.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item</Label>
            <Select value={itemName} onValueChange={(v) => setItemName(v)}>
              <SelectTrigger id="itemName">
                <SelectValue placeholder={Array.isArray(ngo?.acceptedItems) && ngo.acceptedItems.length > 0 ? 'Select an item' : 'No items configured by NGO'} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(ngo?.acceptedItems) && ngo.acceptedItems.length > 0 ? (
                  ngo.acceptedItems.map((it: string) => (
                    <SelectItem key={it} value={it}>{it}</SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">This NGO has not configured accepted items.</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the items you're donating"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Pickup Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={2}
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="pdf">Supporting Document (PDF Only)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Label htmlFor="pdf" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {file ? file.name : 'Click to upload PDF (optional)'}
                </p>
              </Label>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="images">Upload Images (Max 10)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <Label htmlFor="images" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images
                </p>
              </Label>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded overflow-hidden border"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="w-full h-20 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={donationMutation.isPending}>
              {donationMutation.isPending ? 'Submitting...' : 'Submit Donation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
