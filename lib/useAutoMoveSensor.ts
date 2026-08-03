import { FluidDragActions, SensorAPI } from "react-beautiful-dnd";
import * as tweenFunctions from "tween-functions";
import { GameState } from "../types/game";

function moveStepByStep(
  drag: FluidDragActions,
  transformValues: number[],
  scrollValues: number[]
) {
  requestAnimationFrame(() => {
    const timeline = document.getElementById("timeline");

    if (timeline === null) {
      throw new Error("Can't find #timeline");
    }

    const newPosition = transformValues.shift();
    const newScroll = scrollValues.shift();

    if (newPosition === undefined || newScroll === undefined) {
      drag.drop();
    } else {
      timeline.scrollLeft = newScroll;
      drag.move({ x: newPosition, y: 0 });
      moveStepByStep(drag, transformValues, scrollValues);
    }
  });
}

export default async function useAutoMoveSensor(
  state: GameState,
  api: SensorAPI
) {
  if (
    state.badlyPlaced === null ||
    state.badlyPlaced.index === null ||
    state.badlyPlaced.rendered === false
  ) {
    return;
  }

  const preDrag = api.tryGetLock?.(state.played[state.badlyPlaced.index].id);

  if (!preDrag) {
    return;
  }

  const itemEl: HTMLElement | null = document.querySelector(
    `[data-rbd-draggable-id='${state.played[state.badlyPlaced.index].id}']`
  );
  const destEl: HTMLElement | null = document.querySelector(
    `[data-rbd-draggable-id='${
      state.played[state.badlyPlaced.index + state.badlyPlaced.delta].id
    }']`
  );
  const timelineEl: HTMLElement | null = document.getElementById("timeline");

  if (itemEl === null || destEl === null || timelineEl === null) {
    throw new Error("Can't find element");
  }

  const timelineCentreLeft = timelineEl.scrollLeft + timelineEl.clientWidth / 4;
  const timelineCentreRight =
    timelineEl.scrollLeft + (timelineEl.clientWidth / 4) * 3 - itemEl.clientWidth;

  let scrollDistance = 0;

  if (
    destEl.offsetLeft < timelineCentreLeft ||
    destEl.offsetLeft > timelineCentreRight
  ) {
    // Destination is not in middle two quarters of the screen. Calculate
    // distance we therefore need to scroll.
    scrollDistance =
      destEl.offsetLeft < timelineCentreLeft
        ? destEl.offsetLeft - timelineCentreLeft
        : destEl.offsetLeft - timelineCentreRight;

    if (timelineEl.scrollLeft + scrollDistance < 0) {
      scrollDistance = -timelineEl.scrollLeft;
    } else if (
      timelineEl.scrollLeft + scrollDistance >
      timelineEl.scrollWidth - timelineEl.clientWidth
    ) {
      scrollDistance =
        timelineEl.scrollWidth - timelineEl.clientWidth - timelineEl.scrollLeft;
    }
  }

  // Calculate the distance we need to move the item after taking into account
  // how far we are scrolling.
  const transformDistance =
    destEl.offsetLeft - itemEl.offsetLeft - scrollDistance;

  const drag = preDrag.fluidLift({ x: 0, y: 0 });

  // Create a series of eased transformations and scrolls to animate from the
  // current state to the desired state.
  const transformPoints = [];
  const scrollPoints = [];
  const numberOfPoints = 30 + 5 * Math.abs(state.badlyPlaced.delta);

  for (let i = 0; i < numberOfPoints; i++) {
    transformPoints.push(
      tweenFunctions.easeOutCirc(i, 0, transformDistance, numberOfPoints)
    );
    scrollPoints.push(
      tweenFunctions.easeOutCirc(
        i,
        timelineEl.scrollLeft,
        timelineEl.scrollLeft + scrollDistance,
        numberOfPoints
      )
    );
  }

  moveStepByStep(drag, transformPoints, scrollPoints);
}
