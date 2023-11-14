import React, { FC, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Grid from "./Grid";
import SortableItem from "./SortableItem";
import Item from "./Item";
export interface ItemProps {
  name: string;
  id: string;
}
const initialItems: ItemProps[] = [
  { name: "A", id: "1" },
  { name: "B", id: "2" },
  { name: "C", id: "3" },
  { name: "D", id: "4" },
  { name: "E", id: "5" },
  { name: "F", id: "6" },
  { name: "G", id: "7" },
];

const App: FC = () => {
  const [items, setItems] = useState([...initialItems]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);
  const getIndex = (id: string, prevItems: ItemProps[]) => {
    return prevItems.map((item: ItemProps) => item.id).indexOf(id);
  };
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = getIndex(active.id, items);
        const newIndex = getIndex(over!.id, items);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={5}>
          {items.map((item: ItemProps) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <Item item={items[getIndex(activeId, items)]} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default App;
