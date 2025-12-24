import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { CandleCard } from "@/components/candle/CandleCard";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const Account = () => {
  const { items: wishlistItems } = useWishlist();

  // Mock data - in real app this would come from auth/database
  const mockOrders = [
    {
      id: "ORD-001",
      date: "Dec 20, 2024",
      status: "Delivered",
      total: 3499,
      items: 2
    },
    {
      id: "ORD-002",
      date: "Dec 15, 2024",
      status: "Processing",
      total: 1899,
      items: 1
    }
  ];

  const mockAddresses = [
    {
      id: 1,
      label: "Home",
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      default: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[137px]">
        {/* Hero */}
        <section className="py-16 lg:py-20 text-center border-b border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Welcome Back
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                My Account
              </h1>
              <p className="text-muted-foreground">
                Manage your orders, addresses, and preferences
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Account Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="w-full justify-start border-b border-border/30 rounded-none h-auto p-0 bg-transparent overflow-x-auto">
                <TabsTrigger 
                  value="profile" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="wishlist"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <ScrollReveal>
                  <div className="max-w-2xl">
                    <h2 className="font-display text-2xl text-foreground mb-6">Profile Settings</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" className="mt-2" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john@example.com" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" defaultValue="+91 98765 43210" className="mt-2" />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button>Save Changes</Button>
                        <Button variant="outline" className="text-destructive hover:text-destructive">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <ScrollReveal>
                  <div>
                    <h2 className="font-display text-2xl text-foreground mb-6">Order History</h2>
                    {mockOrders.length > 0 ? (
                      <div className="space-y-4">
                        {mockOrders.map((order) => (
                          <div 
                            key={order.id}
                            className="border border-border/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-foreground">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{order.date} · {order.items} items</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-sm ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                                  : 'bg-primary/10 text-primary border border-primary/20'
                              }`}>
                                {order.status}
                              </span>
                              <p className="font-display text-lg text-foreground">₹{order.total.toLocaleString()}</p>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-dashed border-border/50">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-4">No orders yet</p>
                        <Button asChild>
                          <Link to="/shop">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <ScrollReveal>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-2xl text-foreground">Saved Addresses</h2>
                      <Button>Add New Address</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockAddresses.map((address) => (
                        <div 
                          key={address.id}
                          className="border border-border/50 p-6 hover:border-primary/30 transition-colors relative"
                        >
                          {address.default && (
                            <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-sm">
                              Default
                            </span>
                          )}
                          <p className="font-medium text-foreground mb-1">{address.label}</p>
                          <p className="text-muted-foreground text-sm">{address.name}</p>
                          <p className="text-muted-foreground text-sm">{address.address}</p>
                          <p className="text-muted-foreground text-sm">{address.city}, {address.state} {address.zip}</p>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                          </div>
                        </div>
                      ))}
                      <div className="border border-dashed border-border/50 p-6 flex items-center justify-center min-h-[200px]">
                        <Button variant="ghost">
                          <MapPin className="h-4 w-4 mr-2" />
                          Add New Address
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <ScrollReveal>
                  <div>
                    <h2 className="font-display text-2xl text-foreground mb-6">
                      My Wishlist ({wishlistItems.length})
                    </h2>
                    {wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((candle, index) => (
                          <CandleCard key={candle.id} candle={candle} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 border border-dashed border-border/50">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                        <Button asChild>
                          <Link to="/shop">Browse Collection</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
