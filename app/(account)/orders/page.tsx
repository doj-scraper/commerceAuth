import { auth } from '@clerk/nextjs/server';
import { Package2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/app/actions/order.actions';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const res = await getUserOrders();
  if (!res.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ct-text">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm font-mono text-red-400">
          ERR_FETCH_ORDERS: {res.error}
        </div>
      </div>
    );
  }

  const orders = res.orders || [];

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-32">
      <div className="mb-12">
        <div className="text-micro mb-2 text-ct-accent">Operations Center</div>
        <h1 className="heading-display text-4xl text-ct-text">Order Ledger</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ct-text-secondary/20 bg-ct-bg-secondary/30 px-6 py-24">
          <Package2 className="mb-4 h-12 w-12 text-ct-text-secondary/30" />
          <div className="text-sm text-ct-text-secondary">No transaction history found.</div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-xl border border-ct-text-secondary/10 bg-ct-bg-secondary/40">
              <div className="grid grid-cols-2 gap-4 border-b border-ct-text-secondary/10 bg-ct-bg/50 p-4 md:grid-cols-4">
                <div>
                  <div className="text-micro text-ct-text-secondary">Reference ID</div>
                  <div className="mt-1 text-sm font-mono uppercase text-ct-text">{order.id.slice(-8)}</div>
                </div>
                <div>
                  <div className="text-micro text-ct-text-secondary">Timestamp</div>
                  <div className="mt-1 text-sm font-mono text-ct-text">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-micro text-ct-text-secondary">Status</div>
                  <div className="mt-1 inline-block rounded-sm border border-ct-accent/20 bg-ct-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-ct-accent">
                    {order.status}
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="text-micro text-ct-text-secondary">Total Settled</div>
                  <div className="mt-1 text-lg font-bold text-ct-text">${Number(order.total).toFixed(2)}</div>
                </div>
              </div>

              <div className="bg-ct-bg-secondary/20 p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ct-text-secondary/10 text-left">
                      <th className="pb-2 text-micro font-normal text-ct-text-secondary">Qty</th>
                      <th className="pb-2 text-micro font-normal text-ct-text-secondary">Component</th>
                      <th className="pb-2 text-micro font-normal text-ct-text-secondary text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ct-text-secondary/5">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="w-16 py-3 font-mono text-ct-text">{item.quantity}</td>
                        <td className="py-3 font-medium uppercase tracking-[0.04em] text-ct-text-secondary">{item.partName}</td>
                        <td className="py-3 text-right font-mono text-ct-text">${Number(item.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
