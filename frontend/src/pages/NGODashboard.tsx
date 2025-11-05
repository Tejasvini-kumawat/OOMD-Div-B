import { motion } from 'framer-motion';
import { Check, X, Package, Clock, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configureNGO, fetchNGODonations, updateDonationStatus } from '@/api';
import { Checkbox } from '@/components/ui/checkbox';
import { ITEM_CATALOG } from '@/data/itemCatalog';

export default function NGODashboard() {

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [itemFilter, setItemFilter] = useState<string>('all');

  const [ngo, setNgo] = useState<any>(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const ngoId = localStorage.getItem('userId');

  const [selectedItems, setSelectedItems] = useState<string[]>(Array.isArray(ngo?.acceptedItems) ? ngo.acceptedItems : []);
  const [customItem, setCustomItem] = useState<string>('');

  const [showConfiguration, setShowConfiguration] = useState(false);

  // Fetch donations for this NGO
  const { data: donationsRaw, isLoading } = useQuery({
    queryKey: ["ngoDonations", ngoId],
    queryFn: () => fetchNGODonations(ngoId),
    staleTime: 1000 * 60 * 1,  // keep data fresh for 1 minute
    refetchInterval: 1000,     //  refetch every 1 seconds
  });

  const configureMutation = useMutation({
    mutationFn: async (items: string[]) => configureNGO(items),
    onSuccess: (data) => {
      if (data?.success && data?.user) {
        // persist updated user
        localStorage.setItem('user', JSON.stringify(data.user));
        setNgo(data.user);
        toast({ title: 'Configuration saved', description: 'Your accepted items have been updated.' });
      }
    },
    onError: (err: any) => {
      toast({ title: 'Failed to save', description: err?.response?.data?.message || 'Please try again', variant: 'destructive' });
    }
  });

  // Ensure donations is always an array
  const donations = Array.isArray(donationsRaw) ? donationsRaw : [];

  // Mutation to update donation status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await updateDonationStatus(id, status);
    },
    onSuccess: () => {
      toast({
        title: 'Donation Status Updated',
        description: 'The donor will be notified.',
      });
      queryClient.invalidateQueries({ queryKey: ['ngoDonations', ngoId] });
      queryClient.refetchQueries({ queryKey: ['ngoDonations', ngoId] });
    },
    onError: () => {
      toast({
        title: 'Action failed',
        description: 'Unable to update donation status.',
        variant: 'destructive',
      });
    },
  });

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate({ id, status: 'rejected' });
  };

  // Badge helper
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { className: 'bg-warning/10 text-warning border-warning/20', label: 'Pending', icon: Clock },
      approved: { className: 'bg-success/10 text-success border-success/20', label: 'Approved', icon: Check },
      rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected', icon: X },
    };
    const variant = variants[status as keyof typeof variants];
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  // Filtered donations
  console.log(donations);

  const filteredByStatus = filterStatus === 'all'
    ? donations
    : donations.filter(d => d.status === filterStatus);

  const filteredDonations = itemFilter === 'all'
    ? filteredByStatus
    : filteredByStatus.filter(d => d.itemName === itemFilter);

  const pendingCount = donations.filter(d => d.status === 'pending').length;
  const approvedCount = donations.filter(d => d.status === 'approved').length;
  const rejectedCount = donations.filter(d => d.status === 'rejected').length;

  // Counts per accepted item
  const itemCounts: Record<string, number> = selectedItems.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = donations.filter((d) => d.itemName === item).length;
    return acc;
  }, {} as Record<string, number>);


  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

         {/* NGO  Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">NGO Dashboard</h1>

            <p className="text-muted-foreground mb-8">Manage incoming donation requests</p>
          </div>
          <Button onClick={() => setShowConfiguration(prev => !prev)}>
            {showConfiguration ? 'Back to Dashboard' : 'Edit Item Configuration Card'}
          </Button>
        </div>

              {/* Stats */}
        {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Requests</CardDescription>
              <CardTitle className="text-3xl">{pendingCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl">{approvedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl">{rejectedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Donations</CardDescription>
              <CardTitle className="text-3xl">{donations.length}</CardTitle>
            </CardHeader>
          </Card>
        </div> */}

                   {/* Conditional Rendering */}
        {showConfiguration ? (
          // CONFIGURATION CARD
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle>Donation Settings</CardTitle>
              <CardDescription>
                {ngo?.isConfigured
                  ? 'Update the list of items you accept from donors.'
                  : 'Add the list of items you accept. Users can donate only from this list.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Accepted items (choose from catalog)</Label>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ITEM_CATALOG.map((item) => {
                    const checked = selectedItems.includes(item);
                    return (
                      <label key={item} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const isChecked = Boolean(v);
                            setSelectedItems((prev) =>
                              isChecked ? [...new Set([...prev, item])] : prev.filter((it) => it !== item)
                            );
                          }}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>

                {/* Add custom item */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Other item (type and add)"
                    value={customItem}
                    onChange={(e) => setCustomItem(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const name = customItem.trim();
                      if (!name) return;
                      setSelectedItems((prev) => [...new Set([...prev, name])]);
                      setCustomItem('');
                    }}
                  >
                    Add
                  </Button>
                </div>

                {selectedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.map((it) => (
                      <Badge key={it} variant="outline" className="text-xs flex items-center gap-1">
                        {it}
                        <button type="button" aria-label={`remove ${it}`} onClick={() => setSelectedItems((prev) => prev.filter((x) => x !== it))}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div>
                  <Button
                    onClick={() => {
                      if (selectedItems.length === 0) {
                        toast({ title: 'Please select at least one item', variant: 'destructive' });
                        return;
                      }
                      configureMutation.mutate(selectedItems);
                    }}
                    disabled={configureMutation.isPending}
                  >
                    {configureMutation.isPending ? 'Saving...' : ngo?.isConfigured ? 'Update Items' : 'Save Items'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          // DONATION LIST
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Donation Requests</h2>
              <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All ({donations.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Accepted Items Filter Bar */}
            <div className="border-t pt-4 mb-6">
              {selectedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accepted items configured yet.</p>
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <Button
                    size="sm"
                    variant={itemFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setItemFilter('all')}
                  >
                    All Items ({donations.length})
                  </Button>
                  {selectedItems.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={itemFilter === item ? 'default' : 'outline'}
                      onClick={() => setItemFilter(item)}
                      className="flex items-center gap-2"
                    >
                      <span>{item}</span>
                      <Badge variant="secondary">{itemCounts[item] ?? 0}</Badge>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : filteredDonations.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No {filterStatus} donation requests</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredDonations.map((donation) => (
                  <motion.div key={donation._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{donation.itemName}</CardTitle>
                            <CardDescription className="mt-1">From: {donation.userId?.name || 'Unknown'}</CardDescription>
                          </div>
                          {getStatusBadge(donation.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Description:</p>
                            <p className="text-sm text-muted-foreground">{donation.description}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">Donor Contact:</p>
                            <p className="text-sm text-muted-foreground">📧 {donation.userEmail}</p>
                            <p className="text-sm text-muted-foreground">📞 {donation.userPhoneNumber}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">Pickup Address:</p>
                            <p className="text-sm text-muted-foreground">{donation.userAddress}</p>
                          </div>

                          {donation.images?.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Donated Item Images:</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {donation.images.map((img: string, index: number) => (
                                  <motion.div key={index} className="relative group" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                    <img src={img} alt={`Donation ${index + 1}`} className="w-full h-32 object-cover rounded-md border" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-md transition">
                                      <Button variant="secondary" size="sm" className="text-xs" onClick={() => window.open(img, "_blank")}>
                                        <ExternalLink className="w-3 h-3 mr-1" /> Open
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Submitted: {new Date(donation.createdAt).toLocaleDateString()}</span>
                            {donation.status !== 'pending' && (
                              <span>• Updated: {new Date(donation.updatedAt).toLocaleDateString()}</span>
                            )}
                          </div>

                          {donation.status === 'pending' && (
                            <div className="flex gap-3 pt-4">
                              <Button onClick={() => handleReject(donation._id)} variant="outline" className="flex-1">
                                <X className="w-4 h-4 mr-2" /> Reject
                              </Button>
                              <Button onClick={() => handleApprove(donation._id)} className="flex-1">
                                <Check className="w-4 h-4 mr-2" /> Approve
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}
       

      </motion.div>
    </div>
  );
}
