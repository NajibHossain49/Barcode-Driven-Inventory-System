import KanbanBoard from "./components/KanbanBoard";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Barcode Inventory System</h1>
      <KanbanBoard />
    </main>
  );
}
