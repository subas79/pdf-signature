// @ts-nocheck
import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Rnd } from "react-rnd";

import { errorColor, goodColor, primary45 } from "../utils/colors.ts";

export default function DraggableSignature({
  url,
  onEnd,
  onSet,
  onCancel,
}: any) {
  const [scaleRatio, setScaleRatio] = React.useState<any>({
    changedHeight: 72,
    changedWidth: 200,
  });
  const [scaleValue, setScaleValue] = React.useState(0);

  React.useEffect(() => {
    let result =
      (scaleRatio.changedHeight / 180) * (scaleRatio.changedWidth / 500);
    setScaleValue(result);
  }, [scaleRatio]);

  const styles: any = {
    container: {
      position: "absolute",
      zIndex: 10000,
      border: `2px solid ${primary45}`,
    },
    controls: {
      position: "absolute",
      right: 0,
      display: "inline-block",
      backgroundColor: primary45,
      border: `1px solid ${primary45}`,
    },
    smallButton: {
      display: "inline-block",
      cursor: "pointer",
      padding: 1,
    },
  };

  return (
    <Rnd
      style={{}}
      maxWidth={500}
      minWidth={100}
      default={{
        x: 0,
        y: 8,
        width: 200,
        height: 72,
      }}
      onDragStop={(e) => {
        onEnd(e);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setScaleRatio({
          changedHeight: scaleRatio.changedHeight + delta.height,
          changedWidth: scaleRatio.changedWidth + delta.width,
        });
      }}
      lockAspectRatio={true}
      enableUserSelectHack={true}
    >
      <div style={styles.container}>
        <img src={url} width="100%" style={styles.img} draggable={false} />
        <div style={styles.controls}>
          <div style={styles.smallButton} onClick={onCancel}>
            <FaTimes color={errorColor} />
          </div>
          <div
            style={styles.smallButton}
            onClick={() => onSet(scaleValue, scaleRatio)}
          >
            <FaCheck color={goodColor} />
          </div>
        </div>
      </div>
    </Rnd>
  );
}
