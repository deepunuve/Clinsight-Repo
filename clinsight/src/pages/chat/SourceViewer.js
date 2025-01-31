import React, { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Dynamically set the worker script using ES module syntax
GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

const SourceViewer = ({ pdfData }) => {
    const canvasRef = useRef(null);
    const [showPdf, setShowPdf] = useState(false);

    const renderPDF = async (pageNumber) => {
        pageNumber = 1;
        const byteCharacters = atob(pdfData.Data);  // Decode the base64-encoded data
        const byteNumbers = new Uint8Array(byteCharacters.length).map((_, i) =>
            byteCharacters.charCodeAt(i)
        );
        const pdfBlob = new Blob([byteNumbers], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        try {
            const pdf = await getDocument(pdfUrl).promise;

            if (pageNumber < 1 || pageNumber > pdf.numPages) {
                console.error("Invalid page number:", pageNumber);
                return; // Exit if the page number is out of bounds
            }

            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1 });

            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            // Dynamically set the canvas size based on the viewport of the page
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport,
            };

            await page.render(renderContext).promise;
        } catch (error) {
            console.error("Error rendering PDF:", error);
        }
    };

    // Automatically load the PDF when component mounts
    useEffect(() => {
        if (pdfData) {
            renderPDF(1);
            setShowPdf(true);
        }
    }, [pdfData]);

    return (
        <div>
            {showPdf ? (
                <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    );
};
export default SourceViewer;
