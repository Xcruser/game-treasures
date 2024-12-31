import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function OrderConfirmationPage({
  params: { orderId },
}: {
  params: { orderId: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Vielen Dank für Ihre Bestellung!</h1>
          <p className="text-gray-400">
            Ihre Bestellnummer: {order.id}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                </div>
                <span>€{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between items-center font-bold">
              <span>Gesamtsumme</span>
              <span>€{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Versandinformationen</h2>
          <p className="whitespace-pre-wrap">{order.shippingAddress}</p>
        </div>

        <div className="text-center text-gray-400">
          <p>Eine Bestätigungs-E-Mail wurde an {order.email} gesendet.</p>
          <p className="mt-2">Bei Fragen kontaktieren Sie uns bitte unter support@game-treasures.com</p>
        </div>
      </div>
    </div>
  );
}
