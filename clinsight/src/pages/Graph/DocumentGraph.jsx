import React, { Component } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { getGraphDocData } from '../../api/graph';
import { Form, Spinner, Card, Row, Col } from 'react-bootstrap'; // Import React Bootstrap components
import * as THREE from 'three'; // Add this import for THREE

class DocumentGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: null,
            layout: '',
            isLoading: false,
        };
        this.fgRef = React.createRef();
    }

    handleNodeHover = (node) => {
        this.setState({ hoveredNode: node });
    };

    handleNodeDrag = (node) => {
        this.setState({ hoveredNode: node });
    };

    handleNodeDragEnd = () => {
        this.setState({ hoveredNode: null });
    };

    componentDidMount() {
        this.getGraphDataDetails(this.props.payload);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.layout !== prevState.layout) {
            this.applyLayout();
        }
        if (prevProps.payload !== this.props.payload) {
            this.getGraphDataDetails(this.props.payload);
        }
    }

    getGraphDataDetails = async (payload) => {
        this.setState({ isLoading: true });
        try {
            const response = await getGraphDocData(payload);
            this.setState({ elements: response }, this.applyLayout); // Ensure layout is applied on data load
        } catch (error) {
            console.error('Error fetching graph data:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleGraphClick(newValue) {
        this.props.onClick(newValue);
    }

    handleLayoutChange = async (event) => {
        const layout = event.target.value;
        this.setState({ layout });

        // Reload data if switching to the default layout
        if (layout === 'default') {
            const storedSessionData = sessionStorage.getItem('sessionData');
            const data = storedSessionData ? JSON.parse(storedSessionData) : null;
            if (data) {
                await this.getGraphDataDetails(data.id);
            }
        }
    };

    applyLayout = () => {
        const { layout, elements } = this.state;
        if (!elements || !this.fgRef.current) return;

        // Apply selected layout
        switch (layout) {
            case 'circular':
                this.applyCircularLayout();
                break;
            case 'grid':
                this.applyGridLayout();
                break;
            case 'random':
                this.applyRandomLayout();
                break;
            case 'radial':
                this.applyRadialLayout();
                break;

            default:
                // Default layout; ensure no positions are fixed
                // Refresh the entire page
                break;
        }

        // Trigger refresh to update the graph
        if (this.fgRef.current) {
            this.fgRef.current.refresh();
        }
    };

    applyCircularLayout = () => {
        const { elements } = this.state;
        const nodeCount = elements.nodes.length;
        const radius = 300;

        elements.nodes.forEach((node, index) => {
            const angle = (index / nodeCount) * 2 * Math.PI;
            node.fx = radius * Math.cos(angle);
            node.fy = radius * Math.sin(angle);
            node.fz = 0;
        });
    };

    applyGridLayout = () => {
        const { elements } = this.state;
        const size = Math.ceil(Math.sqrt(elements.nodes.length));
        const spacing = 50;

        const offsetX = (size - 1) * spacing / 2;
        const offsetY = (size - 1) * spacing / 2;

        elements.nodes.forEach((node, i) => {
            node.fx = (i % size) * spacing - offsetX;
            node.fy = Math.floor(i / size) * spacing - offsetY;
            node.fz = 0;
        });
    };

    applyRandomLayout = () => {
        const { elements } = this.state;

        elements.nodes.forEach((node) => {
            node.fx = (Math.random() - 0.5) * 1000;
            node.fy = (Math.random() - 0.5) * 1000;
            node.fz = (Math.random() - 0.5) * 1000;
        });
    };

    applyRadialLayout = () => {
        const { elements } = this.state;
        const nodeCount = elements.nodes.length;
        const radius = 300;

        elements.nodes.forEach((node, index) => {
            const angle = (index / nodeCount) * 2 * Math.PI;
            node.fx = radius * Math.cos(angle);
            node.fy = radius * Math.sin(angle);
            node.fz = 0;
        });
    };

    resetForceLayout = () => {
        if (this.fgRef.current) {
            // Reset node positions to null
            this.setState(prevState => ({
                elements: {
                    ...prevState.elements,
                    nodes: prevState.elements.nodes.map(node => ({
                        ...node,
                        fx: null,
                        fy: null,
                        fz: null
                    }))
                }
            }), () => {
                this.fgRef.current.refresh();
            });
        }
    };

    render() {
        const { hoveredNode, layout, elements } = this.state;

        if (elements) {
            return (
                <div>
                    {/* Replaced MUI FormControl, InputLabel, Select, and MenuItem with React Bootstrap components */}


                    <div className="graph-container">
                        {this.state.isLoading && <div className="text-center mt-4">
                            <Spinner animation="border" variant="success" />
                        </div>}
                        <div className="mb-3">
                            <Row className="g-3">
                                <Col md={12} lg={12}>
                                    <Card className="shadow-lg rounded">
                                        <Card.Body style={{ padding: '15px' }}>
                                            <div
                                                className="graph-container"
                                                style={{
                                                    position: 'relative',
                                                    width: '100%', // Ensure it takes up full width of the card
                                                    height: '500px', // Set a fixed height, or use a dynamic one if needed
                                                    margin: '0', // Remove default margins around the graph
                                                    overflow: 'hidden', // Prevent the graph from overflowing
                                                }}
                                            > <Row className="mb-3">
                                                    <Col>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <Form.Select value={layout} onChange={this.handleLayoutChange} aria-label="Layout">
                                                                <option value="default">Default</option>
                                                                <option value="circular">Circular</option>
                                                                <option value="grid">Grid</option>
                                                                <option value="random">Random</option>
                                                                <option value="radial">Radial</option>
                                                            </Form.Select>

                                                        </div>
                                                    </Col>
                                                </Row>
                                                <ForceGraph3D
                                                    ref={this.fgRef}
                                                    graphData={elements}
                                                    nodeAutoColorBy="id"
                                                    height={500} // Ensure full height inside parent
                                                    linkWidth={1}
                                                    linkLabel="label"
                                                    linkDirectionalParticleColor={() => 'red'}
                                                    linkDirectionalParticleWidth={6}
                                                    linkHoverPrecision={10}
                                                    onLinkClick={link => this.fgRef.current.emitParticle(link)}
                                                    linkDistance={100}
                                                    nodeRelSize={5}
                                                    nodeOpacity={1}
                                                    onNodeClick={this.handleClick}
                                                    onNodeHover={this.handleNodeHover}
                                                    onNodeDrag={this.handleNodeDrag}
                                                    onNodeDragEnd={this.handleNodeDragEnd}
                                                    nodeThreeObject={(node) => {
                                                        let geometry;
                                                        let material;
                                                        let size;
                                                        let color;
                                                    
                                                        // Define size and color based on node.type
                                                        switch (node.type) {
                                                            case 0:
                                                                size = 5;
                                                                color = "083fde"; // Blue for type 0
                                                                break;
                                                            case 1:
                                                                size = 8;
                                                                color = "0b9250"; // Green for type 1
                                                                break;
                                                            case 2:
                                                                size = 10;
                                                                color = "841899"; // Purple for type 2
                                                                break;
                                                            case 3:
                                                                size = 6;
                                                                color = "f8b400"; // Yellow for type 3
                                                                break;
                                                            case 4:
                                                                size = 7;
                                                                color = "ff5733"; // Orange for type 4
                                                                break;
                                                            case 5:
                                                            default:
                                                                size = 9;
                                                                color = "33cfff"; // Light blue for type 5 or default
                                                                break;
                                                        }
                                                    
                                                        // Use a single SphereGeometry for all node types with adjustable size
                                                        geometry = new THREE.SphereGeometry(size);
                                                        material = new THREE.MeshBasicMaterial({ color: `#${color}` });
                                                    
                                                        return new THREE.Mesh(geometry, material);
                                                    }}
                                                    // nodeThreeObject={(node) => {
                                                    //     let geometry;
                                                    //     let material;
                                                    //     let randomColor;

                                                    //     // Triangle (node.type == 0)
                                                    //     if (node.type == 0) {
                                                    //         const triangleShape = new THREE.Shape();
                                                    //         const radius = 8; // Adjust the radius as needed
                                                    //         for (let i = 0; i < 3; i++) {
                                                    //             const angle = (i / 3) * Math.PI * 2;
                                                    //             const x = Math.cos(angle) * radius;
                                                    //             const y = Math.sin(angle) * radius;
                                                    //             if (i === 0) {
                                                    //                 triangleShape.moveTo(x, y);
                                                    //             } else {
                                                    //                 triangleShape.lineTo(x, y);
                                                    //             }
                                                    //         }
                                                    //         triangleShape.closePath();
                                                    //         geometry = new THREE.ShapeGeometry(triangleShape);
                                                    //         randomColor = "083fde";
                                                    //     }

                                                    //     // Hexagon (node.type == 1)
                                                    //     else if (node.type == 1) {
                                                    //         const hexagonShape = new THREE.Shape();
                                                    //         const radius = 8;
                                                    //         for (let i = 0; i < 6; i++) {
                                                    //             const angle = (i / 6) * Math.PI * 2;
                                                    //             const x = Math.cos(angle) * radius;
                                                    //             const y = Math.sin(angle) * radius;
                                                    //             if (i === 0) {
                                                    //                 hexagonShape.moveTo(x, y);
                                                    //             } else {
                                                    //                 hexagonShape.lineTo(x, y);
                                                    //             }
                                                    //         }
                                                    //         hexagonShape.closePath();
                                                    //         geometry = new THREE.ShapeGeometry(hexagonShape);
                                                    //         randomColor = "0b9250";
                                                    //     }

                                                    //     // Sphere (node.type == 2)
                                                    //     else if (node.type == 2) {
                                                    //         geometry = new THREE.SphereGeometry(5);
                                                    //         randomColor = "841899";
                                                    //     }

                                                    //     // Star (node.type == 3)
                                                    //     else if (node.type == 3) {
                                                    //         const starShape = new THREE.Shape();
                                                    //         const outerRadius = 10;
                                                    //         const innerRadius = 5;
                                                    //         for (let i = 0; i < 10; i++) {
                                                    //             const angle = (i / 10) * Math.PI * 2;
                                                    //             const radius = i % 2 === 0 ? outerRadius : innerRadius;
                                                    //             const x = Math.cos(angle) * radius;
                                                    //             const y = Math.sin(angle) * radius;
                                                    //             if (i === 0) {
                                                    //                 starShape.moveTo(x, y);
                                                    //             } else {
                                                    //                 starShape.lineTo(x, y);
                                                    //             }
                                                    //         }
                                                    //         starShape.closePath();
                                                    //         geometry = new THREE.ShapeGeometry(starShape);
                                                    //         randomColor = "f8b400"; // Star color (bright yellow)
                                                    //     }

                                                    //     // Pentagon (node.type == 4)
                                                    //     else if (node.type == 4) {
                                                    //         const pentagonShape = new THREE.Shape();
                                                    //         const radius = 8;
                                                    //         for (let i = 0; i < 5; i++) {
                                                    //             const angle = (i / 5) * Math.PI * 2;
                                                    //             const x = Math.cos(angle) * radius;
                                                    //             const y = Math.sin(angle) * radius;
                                                    //             if (i === 0) {
                                                    //                 pentagonShape.moveTo(x, y);
                                                    //             } else {
                                                    //                 pentagonShape.lineTo(x, y);
                                                    //             }
                                                    //         }
                                                    //         pentagonShape.closePath();
                                                    //         geometry = new THREE.ShapeGeometry(pentagonShape);
                                                    //         randomColor = "ff5733"; // Pentagon color (orange)
                                                    //     }

                                                    //     // Diamond (node.type == 5)
                                                    //     else {
                                                    //         geometry = new THREE.SphereGeometry(5);
                                                    //         randomColor = "841899";
                                                    //         // const diamondShape = new THREE.Shape();
                                                    //         // diamondShape.moveTo(0, 10);  // Top point
                                                    //         // diamondShape.lineTo(6, 0);   // Right point
                                                    //         // diamondShape.lineTo(0, -10); // Bottom point
                                                    //         // diamondShape.lineTo(-6, 0);  // Left point
                                                    //         // diamondShape.closePath();
                                                    //         // geometry = new THREE.ShapeGeometry(diamondShape);
                                                    //         // randomColor = "33cfff"; // Diamond color (light blue)
                                                    //     }

                                                    //     material = new THREE.MeshBasicMaterial({ color: `#${randomColor}` });
                                                    //     return new THREE.Mesh(geometry, material);
                                                    // }}
                                                />
                                            </div>
                                            {hoveredNode && (
                                                <div
                                                    className="hover-details"
                                                >
                                                    <Card style={{ width: '18rem', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)', border: 'none' }}>
                                                        <Card.Body style={{ borderLeft: "5px solid blue" }}>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Name:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>{hoveredNode.label}</span>
                                                            </Card.Text>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Protocol Number:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>{hoveredNode.protocolNumber}</span>
                                                            </Card.Text>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Protocol Version:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>{hoveredNode.protocolVersion}</span>
                                                            </Card.Text>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Current Version Date:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>{hoveredNode.currentversionDate}</span>
                                                            </Card.Text>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '0' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Sponsor:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>{hoveredNode.sponsor}</span>
                                                            </Card.Text>
                                                        </Card.Body>
                                                    </Card>

                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                    </div>
                </div>
            );
        }
        return null;
    }
}

export default DocumentGraph;
