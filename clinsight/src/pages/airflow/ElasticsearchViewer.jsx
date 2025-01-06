import React from "react";

const ElasticsearchViewer = () => {
    const elasticsearchUrl = "http://184.105.215.253:5601/";
    const username = "elastic";
    const password = "nuve123";

    // Encode the credentials in base64
    const encodedCredentials = btoa(`${username}:${password}`);

    return (
        <iframe
            src={elasticsearchUrl}
            style={{ width: "100%", height: "100vh", border: "none" }}
            title="Elasticsearch Viewer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="fullscreen"
            // Include the Authorization header with Basic Auth
            onLoad={(e) => {
                const iframeDoc = e.target.contentDocument || e.target.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(`
          <html>
            <head></head>
            <body>
              <script>
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '${elasticsearchUrl}', true);
                xhr.setRequestHeader('Authorization', 'Basic ${encodedCredentials}');
                xhr.send();
                xhr.onload = function() {
                  document.open();
                  document.write(xhr.responseText);
                  document.close();
                };
              </script>
            </body>
          </html>
        `);
                iframeDoc.close();
            }}
        />
    );
};

export default ElasticsearchViewer;
