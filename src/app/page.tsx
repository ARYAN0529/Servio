// This is a Server Component (the default in the App Router): it renders
// on the server and sends plain HTML. No "use client" needed because the
// page has no interactivity yet, which also makes it fast to load.

const steps = [
  { title: "Scan", text: "Customers scan the QR code on their table." },
  { title: "Order & pay", text: "They browse the menu, order, and pay from their phone." },
  { title: "Kitchen sees it", text: "The order appears instantly on the kitchen dashboard." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero section */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Servora</h1>
        <p className="mt-4 text-lg text-gray-600">
          Scan, order, and pay at the table. No waiting, no app to install.
        </p>
      </section>

      {/* How it works: rendered from the array above so adding a step is one line */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-8 text-center text-2xl font-semibold">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-gray-200 p-6">
              <div className="text-sm font-semibold text-orange-600">Step {i + 1}</div>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Servora
      </footer>
    </main>
  );
}