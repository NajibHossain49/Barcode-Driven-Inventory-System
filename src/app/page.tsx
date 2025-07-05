import KanbanBoard from "./components/KanbanBoard";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <KanbanBoard />
      </main>
    </>
  );
}
