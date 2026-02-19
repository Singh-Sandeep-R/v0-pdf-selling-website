import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export default function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY;

  if (!searchParams.key || searchParams.key !== ADMIN_KEY) {
    return notFound();
  }

  let orders: any[] = [];

  if (fs.existsSync(ORDERS_FILE)) {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
  }

  // --------- BASIC STATS ----------
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.amount || 0),
    0
  );

  const now = new Date();

  return (
    <div className="min-h-screen bg-background text-foreground px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        Admin — Orders
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400">
            ₹{totalRevenue}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="text-lg font-semibold">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-xl">
          <thead className="bg-card">
            <tr>
              <th className="p-4 text-left">Book</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Payment ID</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Expiry</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No orders found.
                </td>
              </tr>
            )}

            {orders.map((order, index) => {
              const isExpired =
                order.expiresAt &&
                new Date(order.expiresAt) < now;

              return (
                <tr
                  key={index}
                  className="border-t border-border hover:bg-secondary/20"
                >
                  <td className="p-4">{order.bookId}</td>
                  <td className="p-4">{order.email}</td>
                  <td className="p-4">{order.paymentId}</td>

                  <td className="p-4">
                    {isExpired ? (
                      <span className="text-red-400 font-semibold">
                        Expired
                      </span>
                    ) : (
                      <span className="text-green-400 font-semibold">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {order.expiresAt
                      ? new Date(order.expiresAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
