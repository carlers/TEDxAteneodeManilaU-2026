"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

const GALLERY_WIDTH = 1440;
const GALLERY_HEIGHT = 667;
const KEYBOARD_DRAG_STEP = 120;
const AUTO_SCROLL_SPEED = 38;
const ROW_COPY_MULTIPLIERS = [-1, 0, 1] as const;

type Frame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ImageLayer = {
  left: string;
  top: string;
  width: string;
  height: string;
};

type GalleryTile = {
  id: string;
  src: string;
  frame: Frame;
  image: ImageLayer;
};

type DragState = {
  pointerId: number | null;
  startX: number;
  startOffset: number;
};

const topRowTiles: GalleryTile[] = [
  {
    id: "top-right",
    src: "/about/past-moments/top-right.jpg",
    frame: { left: 1041, top: 0, width: 389, height: 313 },
    image: {
      left: "-20.27%",
      top: "-3.9%",
      width: "130.19%",
      height: "107.83%",
    },
  },
  {
    id: "top-left",
    src: "/about/past-moments/top-left.jpg",
    frame: { left: 0, top: 2, width: 587, height: 310 },
    image: {
      left: "-0.01%",
      top: "-13.16%",
      width: "98.41%",
      height: "124.25%",
    },
  },
  {
    id: "top-center",
    src: "/about/past-moments/top-center.jpg",
    frame: { left: 576, top: 2, width: 465, height: 310 },
    image: {
      left: "-0.01%",
      top: "0%",
      width: "100.02%",
      height: "100%",
    },
  },
  {
    id: "top-offscreen-2",
    src: "/about/past-moments/top-offscreen-2.jpg",
    frame: { left: 1894, top: 2, width: 586, height: 310 },
    image: {
      left: "0%",
      top: "-13.12%",
      width: "100%",
      height: "126.23%",
    },
  },
  {
    id: "top-offscreen-1",
    src: "/about/past-moments/top-offscreen-1.jpg",
    frame: { left: 1430, top: 0, width: 464, height: 309 },
    image: {
      left: "0%",
      top: "0%",
      width: "100%",
      height: "100%",
    },
  },
];

const bottomRowTiles: GalleryTile[] = [
  {
    id: "bottom-offscreen-2",
    src: "/about/past-moments/bottom-offscreen-2.jpg",
    frame: { left: -812, top: 367, width: 465, height: 310 },
    image: {
      left: "0%",
      top: "0%",
      width: "100%",
      height: "100.01%",
    },
  },
  {
    id: "bottom-offscreen-1",
    src: "/about/past-moments/bottom-offscreen-1.jpg",
    frame: { left: -1313, top: 367, width: 501, height: 310 },
    image: {
      left: "-2.22%",
      top: "-58.43%",
      width: "102.24%",
      height: "248.06%",
    },
  },
  {
    id: "bottom-peek-left",
    src: "/about/past-moments/bottom-peek-left.jpg",
    frame: { left: -348, top: 367, width: 465, height: 310 },
    image: {
      left: "-1.76%",
      top: "-1.68%",
      width: "103.56%",
      height: "103.36%",
    },
  },
  {
    id: "bottom-left",
    src: "/about/past-moments/bottom-left.jpg",
    frame: { left: 117, top: 367, width: 362, height: 309 },
    image: {
      left: "-24.43%",
      top: "-0.01%",
      width: "128.24%",
      height: "100.01%",
    },
  },
  {
    id: "bottom-center",
    src: "/about/past-moments/bottom-center.jpg",
    frame: { left: 479, top: 367, width: 481, height: 309 },
    image: {
      left: "0%",
      top: "-0.02%",
      width: "100%",
      height: "103.77%",
    },
  },
  {
    id: "bottom-right",
    src: "/about/past-moments/bottom-right.jpg",
    frame: { left: 960, top: 367, width: 464, height: 309 },
    image: {
      left: "0%",
      top: "0%",
      width: "100%",
      height: "100%",
    },
  },
];

const dragStickerFrame: Frame = {
  left: 1046,
  top: 309,
  width: 100,
  height: 100,
};

function toPercent(value: number, base: number) {
  return `${(value / base) * 100}%`;
}

function frameStyle(frame: Frame) {
  return {
    left: toPercent(frame.left, GALLERY_WIDTH),
    top: toPercent(frame.top, GALLERY_HEIGHT),
    width: toPercent(frame.width, GALLERY_WIDTH),
    height: toPercent(frame.height, GALLERY_HEIGHT),
  };
}

function getRepeatWidth(tiles: GalleryTile[]) {
  const minLeft = Math.min(...tiles.map((tile) => tile.frame.left));
  const maxRight = Math.max(
    ...tiles.map((tile) => tile.frame.left + tile.frame.width)
  );

  return maxRight - minLeft;
}

function wrapOffset(offset: number, repeatWidth: number) {
  const wrappedOffset = offset % repeatWidth;

  return wrappedOffset >= 0 ? wrappedOffset : wrappedOffset + repeatWidth;
}

function GalleryRow({
  tiles,
  repeatWidth,
}: {
  tiles: GalleryTile[];
  repeatWidth: number;
}) {
  return (
    <>
      {ROW_COPY_MULTIPLIERS.flatMap((copyMultiplier) =>
        tiles.map((tile) => (
          <div
            key={`${tile.id}-${copyMultiplier}`}
            aria-hidden="true"
            className="absolute overflow-hidden"
            style={frameStyle({
              ...tile.frame,
              left: tile.frame.left + copyMultiplier * repeatWidth,
            })}
          >
            <div
              className="absolute bg-cover bg-no-repeat"
              style={{
                ...tile.image,
                backgroundImage: `url("${tile.src}")`,
                backgroundPosition: "center",
              }}
            />
          </div>
        ))
      )}
    </>
  );
}

function GalleryStage({ className }: { className: string }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const dragStateRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startOffset: 0,
  });
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);

  const topRowRepeatWidth = getRepeatWidth(topRowTiles);
  const bottomRowRepeatWidth = getRepeatWidth(bottomRowTiles);

  useEffect(() => {
    if (isDragging) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      previousFrameTimeRef.current = null;
      return;
    }

    function step(frameTime: number) {
      if (previousFrameTimeRef.current !== null) {
        const elapsedTime = frameTime - previousFrameTimeRef.current;
        const nextOffset =
          dragOffsetRef.current - (elapsedTime / 1000) * AUTO_SCROLL_SPEED;

        dragOffsetRef.current = nextOffset;
        setDragOffset(nextOffset);
      }

      previousFrameTimeRef.current = frameTime;
      animationFrameRef.current = requestAnimationFrame(step);
    }

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      previousFrameTimeRef.current = null;
    };
  }, [isDragging]);

  function setGalleryOffset(nextOffset: number) {
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  }

  function handleDragStart(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: dragOffset,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (dragState.pointerId !== event.pointerId) {
      return;
    }

    const stageWidth =
      stageRef.current?.getBoundingClientRect().width ?? GALLERY_WIDTH;
    const designSpaceDelta =
      ((event.clientX - dragState.startX) / stageWidth) * GALLERY_WIDTH;

    setGalleryOffset(dragState.startOffset + designSpaceDelta);
  }

  function handleDragEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleLostPointerCapture() {
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
  }

  function handleDragKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setGalleryOffset(dragOffsetRef.current - KEYBOARD_DRAG_STEP);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setGalleryOffset(dragOffsetRef.current + KEYBOARD_DRAG_STEP);
    }

    if (event.key === "Home" || event.key === "Escape") {
      event.preventDefault();
      setGalleryOffset(0);
    }
  }

  const topRowTransform = `translate3d(${toPercent(
    wrapOffset(dragOffset, topRowRepeatWidth),
    GALLERY_WIDTH
  )}, 0, 0)`;
  const bottomRowTransform = `translate3d(${toPercent(
    wrapOffset(-dragOffset * 0.88, bottomRowRepeatWidth),
    GALLERY_WIDTH
  )}, 0, 0)`;
  const motionClassName = "will-change-transform";
  const dragHandleClassName =
    "absolute z-10 flex items-center justify-center rounded-full bg-tedx-accent text-tedx-white";
  const dragCursorClassName = isDragging ? "cursor-grabbing" : "cursor-grab";

  return (
    <div
      ref={stageRef}
      aria-label="Past moments gallery. Drag left or right to explore continuously."
      className={`relative overflow-hidden bg-tedx-black select-none outline-none focus-visible:ring-2 focus-visible:ring-tedx-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-tedx-black ${dragCursorClassName} ${className}`}
      style={{ touchAction: "pan-y" }}
      tabIndex={0}
      onKeyDown={handleDragKeyDown}
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handleDragEnd}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${motionClassName}`}
        style={{ transform: topRowTransform }}
      >
        <GalleryRow repeatWidth={topRowRepeatWidth} tiles={topRowTiles} />
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${motionClassName}`}
        style={{ transform: bottomRowTransform }}
      >
        <GalleryRow repeatWidth={bottomRowRepeatWidth} tiles={bottomRowTiles} />
      </div>

      <div
        aria-hidden="true"
        className={`${dragHandleClassName} bottom-4 right-4 size-16 sm:bottom-5 sm:right-5 sm:size-[72px] lg:hidden`}
      >
        <span className="rotate-[10deg] text-sm font-bold leading-none sm:text-base">
          DRAG
        </span>
      </div>

      <div
        aria-hidden="true"
        className={`${dragHandleClassName} hidden lg:flex`}
        style={frameStyle(dragStickerFrame)}
      >
        <span className="rotate-[10deg] text-[clamp(0.72rem,1.4vw,1.125rem)] font-bold leading-none">
          DRAG
        </span>
      </div>
    </div>
  );
}

export default function PastMomentsSection() {
  return (
    <section
      id="past-moments"
      aria-labelledby="past-moments-heading"
      className="bg-tedx-black px-4 py-16 text-tedx-white sm:px-6 lg:px-0 lg:py-0"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <h2
          id="past-moments-heading"
          className="tedx-section-heading-shadow font-league-gothic text-center text-[4rem] leading-[0.8] tracking-[-0.04em] text-tedx-white sm:text-[5.5rem] lg:text-[128px] lg:leading-[0.734375]"
        >
          <span>PAST </span>
          <span className="text-tedx-accent">MOMENTS</span>
        </h2>

        <p className="mt-7 max-w-[752px] px-3 text-center text-sm leading-[1.25] text-tedx-white sm:px-6 sm:text-base lg:mt-[51px] lg:px-0 lg:text-[18px] lg:leading-[21px]">
          From electrifying speaker performances to moving stories, take a look
          at some of last year&apos;s moments that have molded
          TEDxAteneodeManilaU and invigorated the Loyola Campus.
        </p>

        <div className="mt-12 hidden w-full lg:block lg:mt-[51px]">
          <GalleryStage className="aspect-[1440/667] w-full max-w-[1440px]" />
        </div>

        <div className="mt-10 w-full overflow-hidden lg:hidden">
          <div className="relative left-1/2 h-[394px] w-[850px] -translate-x-1/2 sm:h-[487px] sm:w-[1050px]">
            <GalleryStage className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
