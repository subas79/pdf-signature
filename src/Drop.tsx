import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cleanBorder, primary45 } from "./utils/colors.ts";

export default function Drop({ onLoaded }) {
  const styles: any = {
    container: {
      textAlign: "center",
      border: cleanBorder,
      padding: 20,
      marginTop: 12,
      color: primary45,
      fontSize: 14,
      fontWeight: 600,
      borderRadius: 4,
      userSelect: "none",
      outline: 1,
      cursor: "pointer",
      backgroundColor: "rgba(255,221,238, 0.5)"
    },
  };

  const onDrop = useCallback((acceptedFiles) => {
    onLoaded(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  return (
    <div {...getRootProps()} style={styles.container}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop a PDF here</p>
      ) : (
        <p>Drag a PDF here or <u>click here</u> to upload a PDF.</p>
      )}
    </div>
  );
}
