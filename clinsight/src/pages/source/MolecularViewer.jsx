import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

const MolecularViewer = ({ smiles }) => {
    const viewerRef = useRef([]);

    useEffect(() => {
        if (!smiles) return;

        // Split the SMILES string into an array if it's a single string
        const smilesArray = smiles.split('.').map(smile => smile.trim());

        // Loop over each SMILES string to render the viewer
        smilesArray.forEach((smile, index) => {
            const element = viewerRef.current[index];
            if (element) {
                const config = { backgroundColor: 'white' };
                const viewer = $3Dmol.createViewer(element, config);

                // Fetch the SDF file from PubChem using the SMILES string
                const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smile)}/SDF?record_type=3d`;

                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        viewer.addModel(data, 'sdf');
                        viewer.setStyle({}, { stick: {} });
                        viewer.zoomTo();
                        viewer.render();
                    })
                    .catch(error => {
                        console.error('Error fetching the SDF file:', error);
                    });
            }
        });
    }, [smiles]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {smiles && smiles.split('.').map((smile, index) => (
                <div
                    key={index}
                    ref={el => viewerRef.current[index] = el}
                    style={{
                        width: '50%',  // Adjust the width so they fit within the row
                        height: '300px',
                        margin: '10px 0',
                        flexShrink: 0,
                    }}
                ></div>
            ))}
        </div>
    );
};

export default MolecularViewer;
