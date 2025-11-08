import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Item } from "../types/item";
import { Dimension } from "../types/dimension";
import ItemCard from "./item-card";
import styles from "../styles/next-item-list.module.scss";

interface NextItemListProps {
  next: Item | null;
  dimension: Dimension;
}

export default function NextItemList(props: NextItemListProps) {
  const { next, dimension } = props;

  return (
    <div className={styles.container}>
      <Droppable droppableId="next" direction="horizontal">
        {(provided) => (
          <div className={styles.wrapper}>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.list}
            >
              {next && (
                <ItemCard
                  draggable
                  dimension={dimension}
                  index={0}
                  item={next}
                  key={next.id}
                />
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
