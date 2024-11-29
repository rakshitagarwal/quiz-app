"use client"
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const PDFPage = () => {
  const docs = [
    { uri: "https://safetmind.s3.amazonaws.com/books/preview-files/sample.pdf" }, // Remote file

  ];

  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />;
};

export default PDFPage;
