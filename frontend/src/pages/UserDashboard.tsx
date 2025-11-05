import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DonationModal } from '@/components/DonationModal';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDonations, getAllNGOs } from '@/api';
import { NGO } from '@/types';

export default function UserDashboard() {

  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showDonations, setShowDonations] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('userId');

  // Get All UserDonations Data Including Pending,Approved,Rejected
  const { data: userDonations = [], isLoading, error } = useQuery({
    queryKey: ['userDonations', userId],
    queryFn: () => fetchUserDonations(userId),
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000,
    enabled: !!userId, // Only run query if userId exists
    retry: 3,
  });

  useEffect(() => {
    console.log('User ID:', userId);
    console.log('User Donations:', userDonations);
  }, [userId, userDonations]);

  // All Registered NGOs
  const { data: ngos = [], isLoading: ngosLoading } = useQuery<NGO[]>({
    queryKey: ["ngos"],
    queryFn: getAllNGOs,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000
  });

  // Extract Unique NGO Categories
  const ngoCategories: string[] = ['all', ...Array.from(new Set(ngos.map((n: NGO) => n.category || 'Uncategorized')))];

  // Filter NGOs Based on Category
  const filteredNGOs =
    selectedCategory === 'all'
      ? ngos
      : ngos.filter((ngo: NGO) => ngo.category === selectedCategory);

  // Filter User Donations by Status    
  const filteredDonations =
    filterStatus === 'all'
      ? userDonations
      : userDonations.filter(d => d.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { className: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
      approved: { className: 'bg-success/10 text-success border-success/20', label: 'Approved' },
      rejected: { className: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Rejected' },
    };
    const variant = variants[status as keyof typeof variants];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getStatusMessage = (status: string) => {
    if (status === 'approved') return <p className="text-sm text-success mt-2">✓ NGO will contact you through your provided contact details in 2-3 weeks</p>;
    if (status === 'rejected') return <p className="text-sm text-destructive mt-2">✗ Donation request was not accepted</p>;
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mb-8">Browse NGOs and make a difference today</p>
          </div>
          <Button onClick={() => setShowDonations(prev => !prev)}>
            {showDonations ? 'Back to NGOs' : 'Track Donation'}
          </Button>
        </div>

        {!showDonations ? (
          // -------------------- NGO GRID --------------------
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured NGOs</h2>

            {/* Category Filter Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-6">
              <TabsList className="flex flex-wrap gap-2 justify-start">
                {ngoCategories.map((cat: string) => (
                  <TabsTrigger key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Filtered NGO Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngosLoading ? (
                <p>Loading NGOs...</p>
              ) : filteredNGOs.length === 0 ? (
                <p>No NGOs found for this category.</p>
              ) : (
                filteredNGOs.map((ngo: any, index: number) => (
                  <motion.div
                    key={ngo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      <img
                        src={ngo.logoUrl || '/placeholder.jpg'}
                        alt={ngo.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl">{ngo.name}</CardTitle>
                          <Badge variant="secondary">{ngo.category}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {ngo.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-4 flex-1">{ngo.description}</p>
                        <Button onClick={() => setSelectedNGO(ngo)} className="w-full">
                          <Gift className="w-4 h-4 mr-2" />
                          Donate Items
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        ) : (
          // -------------------- DONATION HISTORY --------------------
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Your Donation History</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : userDonations.length === 0 ? (
              <Card className="p-12 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No donations yet. Start making a difference!</p>
              </Card>
            ) : (
              <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">All ({userDonations.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({userDonations.filter(d => d.status === 'pending').length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({userDonations.filter(d => d.status === 'approved').length})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({userDonations.filter(d => d.status === 'rejected').length})</TabsTrigger>
                </TabsList>

                <div className="space-y-4">
                  {filteredDonations.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-muted-foreground">No {filterStatus} donations found</p>
                    </Card>
                  ) : (
                    filteredDonations.map((donation) => (
                      <motion.div
                        key={donation._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle>{donation.itemName}</CardTitle>
                                <CardDescription>Donated To: {donation.ngoId.name}</CardDescription>
                              </div>
                              {getStatusBadge(donation.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">{donation.description}</p>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(donation.createdAt).toLocaleDateString()}
                            </p>
                            {getStatusMessage(donation.status)}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </Tabs>
            )}
          </section>
        )}
      </motion.div>

      {selectedNGO && (
        <DonationModal
          ngo={selectedNGO}
          open={!!selectedNGO}
          onClose={() => setSelectedNGO(null)}
        />
      )}
    </div>
  );
}