import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./App.css";
import Drop from "./Drop.tsx";
import Header from "./Header.tsx";
import { AddSigDialog } from "./components/AddSigDialog.tsx";
import BigButton from "./components/BigButton.tsx";
import DraggableImage from "./components/DraggableImage.tsx";
import DraggableSignature from "./components/DraggableSignature.tsx";
import PagingControl from "./components/PagingControl.tsx";
import { blobToURL } from "./utils/Utils.ts";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function downloadURI(uri: any, name: any) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function App() {
  const styles: any = {
    mainContainer: {
      height: "100vh",
    },
    container: {
      maxWidth: 900,
      margin: "0 auto",
    },
    sigBlock: {
      display: "inline-block",
      border: "1px solid #000",
    },
    documentBlock: {
      maxWidth: 800,
      marginTop: 8,
      border: "1px solid #999",
    },
    controls: {
      maxWidth: 800,
      marginTop: 8,
    },
  };
  const [pdf, setPdf] = useState(null);
  const [signatureURL, setSignatureURL] = useState(null);
  const [position, setPosition] = useState<any>(null);
  console.log(position)
  const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageDetails, setPageDetails] = useState(null);
  const [file, setFile] = useState<any>(null);
  const documentRef: any = useRef(null);
  // const hiddenFileInput: any = useRef(null);

  // const handleClick = () => {
  //   hiddenFileInput.current.click();
  // };

  // const handleImageUpload = async event => {
  //   const fileUploaded = event?.target?.files[0];
  //   const res = await blobToURL(fileUploaded);
  //   setFile(res);
  // };

  function handleEnd(e){
    let obj = {x:e.x - e.offsetX , y: e.y - e.offsetY}
    // obj.x = e.x -  + 
    // console.log(e.x - e.offsetX)
    // console.log(e.y - e.offsetY)
    setPosition(obj)

  }

  return (
    <div style={styles.mainContainer}>
      <Header />
      <div style={styles.container}>
        {signatureDialogVisible ? (
          <AddSigDialog
            onClose={() => setSignatureDialogVisible(false)}
            onConfirm={(url: any) => {
              setSignatureURL(url);
              setSignatureDialogVisible(false);
            }}
          />
        ) : null}

        {!pdf ? (
          <Drop
            onLoaded={async (files: any) => {
              const URL: any = await blobToURL(files[0]);
              setPdf(URL);
            }}
          />
        ) : null}
        {pdf ? (
          <div>
            <div style={styles.controls}>
              {!signatureURL ? (
                <BigButton
                  marginRight={8}
                  title="Add signature"
                  onClick={() => setSignatureDialogVisible(true)}
                />
              ) : null}
              {/* {!signatureURL ? (
                <>
                  <BigButton
                    marginRight={8}
                    title="Add image"
                    onClick={() => {
                      setImageVisible(true);
                      handleClick();
                    }}
                  />
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </>
              ) : null} */}
              <BigButton
                marginRight={8}
                title="Reset"
                onClick={() => {
                  setSignatureDialogVisible(false);
                  // setImageVisible(false);
                  setFile(null);
                  setSignatureURL(null);
                  setPdf(null);
                  setTotalPages(0);
                  setPageNum(0);
                  setPageDetails(null);
                }}
              />
              {pdf ? (
                <BigButton
                  marginRight={8}
                  inverted={true}
                  title="Download"
                  onClick={() => {
                    downloadURI(pdf, "file.pdf");
                  }}
                />
              ) : null}
            </div>
            <div>
              {signatureURL && (
                <DraggableSignature
                  url={signatureURL}
                  onCancel={() => {
                    setSignatureURL(null);
                  }}
                  onSet={async (scaleValue: any, scaleRatio: any) => {
                    const { originalHeight, originalWidth }: any = pageDetails;

                    const y =
                      documentRef.current.clientHeight -
                      (position.y - documentRef.current.offsetTop);

                    const x = position.x - documentRef.current.offsetLeft;


                    // console.log("x", x)
                    // console.log("y", y)
                    // console.log("documentRef.current.clientWidth", documentRef.current.clientWidth)
                    // console.log("originalWidth", originalWidth)
                    // console.log("scaleRatio.changedWidth", scaleRatio.changedWidth)


                    const newX =
                      (x / documentRef.current.clientWidth) * originalWidth -
                      (scaleRatio.changedWidth /
                        documentRef.current.clientWidth) *
                        originalWidth;
                        // console.log("newx", newX)

                    const newY =
                      (y / documentRef.current.clientHeight) * originalHeight -
                      (scaleRatio.changedHeight /
                        documentRef.current.clientHeight) *
                        originalHeight -
                      (window.scrollY / documentRef.current.clientHeight) *
                        originalHeight;
                        // console.log("newY", newY)

                    const pdfDoc = await PDFDocument.load(pdf);

                    const pages = pdfDoc.getPages();
                    const firstPage = pages[pageNum];

                    const pngImage = await pdfDoc.embedPng(signatureURL);

                    const width =  (scaleRatio.changedWidth / documentRef.current.clientWidth) * originalWidth

                    firstPage.drawImage(pngImage, {
                      x: newX + width,
                      y: newY,
                      width: width,
                      height:
                        (scaleRatio.changedHeight /
                          documentRef.current.clientHeight) *
                        originalHeight,
                    });
                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([new Uint8Array(pdfBytes)]);

                    const URL: any = await blobToURL(blob);
                    setPdf(URL);
                    setPosition(null);
                    setSignatureURL(null);
                  }}
                  onEnd={handleEnd}
                />
              )}
              {file && (
                <DraggableImage
                  url={file}
                  onCancel={() => {
                    setFile(null);
                  }}
                  onSet={async () => {
                    const { originalHeight, originalWidth }: any = pageDetails;
                    const scale =
                      originalWidth / documentRef.current.clientWidth;
                    const y =
                      documentRef.current.clientHeight -
                      (position.y -
                        position.offsetY +
                        64 -
                        documentRef.current.offsetTop);
                    const x =
                      position.x -
                      160 -
                      position.offsetX -
                      documentRef.current.offsetLeft;

                    const newY =
                      ((y - window.scrollY) * originalHeight) /
                      documentRef.current.clientHeight;
                    const newX =
                      (x * originalWidth) / documentRef.current.clientWidth;

                    const pdfDoc = await PDFDocument.load(pdf);

                    const pages = pdfDoc.getPages();
                    const firstPage = pages[pageNum];

                    const pngImage = await pdfDoc.embedPng(file);
                    const pngDims = pngImage.scale(scale * 0.1);
                    // TODO: Subas - Find a better way to replace these static values
                    firstPage.drawImage(pngImage, {
                      x: 10 + 10,
                      y: newY - 86,
                      width: pngDims.width,
                      height: pngDims.height,
                    });

                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([new Uint8Array(pdfBytes)]);

                    const URL: any = await blobToURL(blob);
                    setPdf(URL);
                    setPosition(null);
                    setFile(null);
                  }}
                  onEnd={setPosition}
                />
              )}
            </div>
            <div ref={documentRef} style={styles.documentBlock}>
              <Document
                className="react-pdf__Page__textContent"
                ref={documentRef}
                file={pdf}
                onLoadSuccess={(data: any) => {
                  setTotalPages(data.numPages);
                }}
              >
                <Page
                  className="doc"
                  pageNumber={pageNum + 1}
                  width={800}
                  height={1200}
                  onLoadSuccess={(data: any) => {
                    setPageDetails(data);
                  }}
                />
              </Document>
            </div>
            <PagingControl
              pageNum={pageNum}
              setPageNum={setPageNum}
              totalPages={totalPages}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
