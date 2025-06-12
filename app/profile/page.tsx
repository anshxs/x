"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  phone_number: string;
  name: string | null;
}

export default function ProfilePage() {
  const [authInfo, setAuthInfo] = useState<{
    id: string;
    confirmed_at: string;
  } | null>(null);

  interface CartItem {
    id: number;
    quantity: number;
    product: {
      id: number;
      title: string;
      short_description: string;
      images: string[];
    };
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [tempName, setTempName] = useState("");

  // Load cart items
  useEffect(() => {
  const loadCart = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("cart")
      .select(
        "id, quantity, product:product_id(id, title, short_description, images)"
      )
      .eq("user_id", user.id);

    if (!error && data) {
      setCartItems(
        data.map((item: any) => ({
          ...item,
          product: Array.isArray(item.product) ? item.product[0] : item.product,
        }))
      );
    }
  };

  loadCart();
}, []);
  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setLoading(false);
        return;
      }

      const authData = {
        id: user.id,
        confirmed_at: user.confirmed_at ?? new Date().toISOString(),
      };

      setAuthInfo(authData);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("id, phone_number, name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError.message);
      }

      setProfile(profileData);

      if (profileData && !profileData.name) {
        setShowDialog(true);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const saveName = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from("users")
      .update({ name: tempName })
      .eq("id", profile.id);
    if (!error) {
      setProfile({ ...profile, name: tempName });
      setShowDialog(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!authInfo || !profile) return <div className="p-4">Not logged in</div>;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((t) => t[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="max-w-3xl mx-auto p-4 mt-5 space-y-6">
      <Dialog open={showDialog}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">What's your name?</h2>
          <Label>Name</Label>
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your full name"
            className="mb-4"
          />
          <Button onClick={saveName} disabled={!tempName.trim()}>
            Save
          </Button>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarFallback className="text-3xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-600">
            Member since{" "}
            <span className="text-md font-semibold">
              {format(new Date(authInfo.confirmed_at), "MMMM dd, yyyy")}
            </span>
          </p>
          <p className="text-sm text-blue-600">{profile.phone_number}</p>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold">Cart Items</h2>
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-2">
                    Your cart is empty.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-md p-3 flex gap-4 items-center"
                      >
                        {item.product.images && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.product.title}</p>
                          
                          <p className="text-sm">
                            {item.product.short_description}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <table className="w-full text-sm mt-2">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["#12345", "2023-08-15", "Shipped", "$150"],
                      ["#12346", "2023-07-20", "Delivered", "$200"],
                      ["#12347", "2023-06-10", "Cancelled", "$50"],
                    ].map(([id, date, status, total]) => (
                      <tr key={id}>
                        <td>{id}</td>
                        <td>{date}</td>
                        <td
                          className={`font-medium ${
                            status === "Delivered"
                              ? "text-green-600"
                              : status === "Cancelled"
                              ? "text-red-600"
                              : status === "Shipped"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {status}
                        </td>

                        <td>{total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <p className="text-sm">[Here will be detailed Orders content]</p>
        </TabsContent>

        <TabsContent value="reviews">
          <p className="text-sm">[Here will be detailed Reviews content]</p>
        </TabsContent>

        <TabsContent value="settings">
          <p className="text-sm">[Here will be Settings options]</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
