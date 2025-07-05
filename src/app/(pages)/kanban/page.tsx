import KanbanBoard from '@/app/components/KanbanBoard';
import Navbar from '@/app/components/Navbar';

export default function KanbanPage() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <KanbanBoard />
      </div>
    </div>
  );
}