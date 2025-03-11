import React, { Component } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { getGraphData } from '../../api/graph';
import * as THREE from 'three';
import { Button, Dropdown, Form, Spinner, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaTimes } from "react-icons/fa";
class ResultGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: null,
            isLoading: true,
            isFullScreen: false,
            // parentWidth: 600,
            // parentHeight: 500,
            sourceNames: [],
            layout: 'default', // Added layout state
            hoveredNode: null,
            selectedNodes: [],
            fullGraph: null, // Store the full dataset
            visibleNodesPercentage: 25, // Start with 25%
        };
        this.fgRef = React.createRef();
        this.geometryCache = {};
        this.materialCache = {};

        // Pre-create geometries and materials
        this.geometryCache.main = new THREE.SphereGeometry(0.5);
        this.geometryCache.default = new THREE.SphereGeometry(0.5);
        this.materialCache.white = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    componentDidMount() {
        const storedNodes = sessionStorage.getItem('selectedNodes');
        if (storedNodes) {
            this.setState({ selectedNodes: JSON.parse(storedNodes) });
        }
        this.getGraphDataDetails(this.props.payload);
    }

    handleNodeHover = (node) => {
        if (node) {
            this.setState({ hoveredNode: node });
        } else {
            this.setState({ hoveredNode: null });
        }
    };

    handleLinkHover = (link, prevLink) => {
        const { elements } = this.state;
        if (link && link !== prevLink) {
            elements.nodes.map((node) => {
                node.hovered = link.source === node.id || link.target === node.id;
            });
            this.setState({ elements });
        }
    };

    handleChildClick = (value) => {
        const { elements } = this.state;
        if (elements) {
            const nodes = elements.nodes.filter((node) =>
                node.label.toLowerCase().includes(value.toLowerCase())
            );
            nodes.map((node) => {
                if (this.fgRef.current) {
                    const distance = 40;
                    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                    this.fgRef.current.cameraPosition(
                        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                        node,
                        3000
                    );
                }
            });
        }
    };

    nodeThreeObject = (node) => {
        let geometry;
        let material;

        if (node.isMain) {
            // Use cached main geometry and material
            geometry = this.geometryCache.main;
            material = this.materialCache.white;
        } else {
            // Use default geometry, scale via mesh properties
            geometry = this.geometryCache.default;

            // Determine scale
            const scale = node.importance && node.importance > 0 ? node.importance * 10 : 10;

            // Determine color, cache materials by color to avoid duplicates
            const color = (node.typeColor || node.color || '#000000').replace(/['"]/g, '');
            if (!this.materialCache[color]) {
                this.materialCache[color] = new THREE.MeshBasicMaterial({ color });
            }
            material = this.materialCache[color];

            // Create a new mesh for each node (Three.js handles this efficiently)
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(scale, scale, scale);
            return mesh;
        }
    };

    handleClick = (node) => {
        this.setState(
            (prevState) => {
                // Avoid duplicates by checking if the node is already selected
                const nodeExists = prevState.selectedNodes.some((n) => n.id === node.id);
                if (!nodeExists) {
                    const updatedSelectedNodes = [...prevState.selectedNodes, node];

                    // Save the updated list to sessionStorage
                    sessionStorage.setItem('selectedNodes', JSON.stringify(updatedSelectedNodes));

                    return { selectedNodes: updatedSelectedNodes };
                }
                return prevState;
            },
            () => {
                // Pass updated selectedNodes to the parent component
                this.props.handleGraphClick(this.state.selectedNodes, node);
            }
        );

        if (this.fgRef.current) {
            const distance = 700;  // Increase this value to reduce the zoom level
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
            this.fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node,
                3000 // duration of the animation in milliseconds
            );
        }
    };

    handleUnselect = (nodeId) => {
        this.setState(
            (prevState) => {
                // Filter out the node to unselect it
                const updatedSelectedNodes = prevState.selectedNodes.filter((node) => node.id !== nodeId);

                // Update sessionStorage with the new selected nodes list
                sessionStorage.setItem('selectedNodes', JSON.stringify(updatedSelectedNodes));

                // Return the updated state
                return { selectedNodes: updatedSelectedNodes };
            },
            () => {
                // Pass updated selectedNodes to the parent component
                this.props.handleGraphClick(this.state.selectedNodes);
            }
        );
    };


    handleGraphClick = (newValue) => {
        // this.props.onClick(newValue);
    };
    handleLoadMore = () => {
        this.setState((prevState) => {
            const newPercentage = Math.min(prevState.visibleNodesPercentage + 25, 100);
            return {
                visibleNodesPercentage: newPercentage,
                elements: this.getPartialGraph(prevState.fullGraph, newPercentage),
            };
        });
    };
    getPartialGraph = (fullGraph, percentage) => {
        alert(percentage);
        if (!fullGraph || !fullGraph.nodes) return null;

        const totalNodes = fullGraph.nodes.length;
        const visibleCount = Math.ceil((percentage / 100) * totalNodes);

        // Get the subset of nodes
        const visibleNodes = fullGraph.nodes.slice(0, visibleCount);
        const visibleNodeIds = new Set(visibleNodes.map(n => n.id)); // Store node IDs for quick lookup

        // Filter links to include only those where both source and target exist in visibleNodes
        const visibleLinks = fullGraph.links.filter(link =>
            visibleNodeIds.has(link.source) && visibleNodeIds.has(link.target)
        );

        return {
            nodes: visibleNodes,
            links: visibleLinks
        };
    };


    getGraphDataDetails = async (payload) => {
        try {
            this.setState({ isLoading: true });
            const response = await getGraphData(payload);

            // Store the full data and initially show 25%
            this.setState({
                fullGraph: response,
                elements: this.getPartialGraph(response, 25),
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching graph data:', error);
            this.setState({ isLoading: false });
        }
    };

    // getGraphDataDetails = async (payload) => {
    //     try {
    //         this.setState({ isLoading: true });
    //         const response = await getGraphData(payload);
    //         this.setState({ elements: response, isLoading: false });
    //         // }
    //     } catch (error) {
    //         console.error('Error fetching graph data:', error);
    //         this.setState({ isLoading: false });
    //     } finally {
    //         this.setState({ isLoading: false });
    //     }
    // };

    handleLayoutChange = (event) => {
        this.setState({ layout: event.target.value });
    };

    applyLayout = () => {
        const { layout, elements } = this.state;
        if (!elements) return;

        switch (layout) {
            case 'circular':
                this.applyCircularLayout(elements);
                break;
            case 'grid':
                this.applyGridLayout(elements);
                break;
            case 'random':
                this.applyRandomLayout(elements);
                break;
            case 'radial':
                this.applyRadialLayout(elements);
                break;
            default:
                // Default layout or reset
                break;
        }

        this.setState({ elements });
    };

    applyCircularLayout = (elements) => {
        const radius = 300;
        elements.nodes.forEach((node, i) => {
            const angle = (i / elements.nodes.length) * 2 * Math.PI;
            node.x = radius * Math.cos(angle);
            node.y = radius * Math.sin(angle);
            node.z = 0;
        });
    };

    applyGridLayout = (elements) => {
        const gridSize = Math.ceil(Math.sqrt(elements.nodes.length));
        elements.nodes.forEach((node, i) => {
            node.x = (i % gridSize) * 50;
            node.y = Math.floor(i / gridSize) * 50;
            node.z = 0;
        });
    };

    applyRandomLayout = (elements) => {
        const spread = 500; // Control the spread of nodes
        elements.nodes.forEach((node) => {
            node.x = (Math.random() - 0.5) * spread;
            node.y = (Math.random() - 0.5) * spread;
            node.z = (Math.random() - 0.5) * spread; // Optional z-axis randomization
        });
    };

    applyRadialLayout = (elements) => {
        const radius = 300;
        const layers = Math.ceil(Math.sqrt(elements.nodes.length));
        elements.nodes.forEach((node, i) => {
            const angle = (i / layers) * 2 * Math.PI;
            const r = (Math.floor(i / layers) + 1) * (radius / layers);
            node.x = r * Math.cos(angle);
            node.y = r * Math.sin(angle);
            node.z = 0;
        });
    };

    componentDidUpdate(prevProps, prevState) {
        // Check if layout has changed before applying layout
        if (prevState.layout !== this.state.layout) {
            this.applyLayout();
        }

        // Check if payload has changed before fetching new graph data
        if (JSON.stringify(prevProps.payload) !== JSON.stringify(this.props.payload)) {
            this.getGraphDataDetails(this.props.payload);
        }
    }

    render() {
        const { isFullScreen, parentWidth, parentHeight, elements, isLoading, layout, hoveredNode, selectedNodes } = this.state;

        return (
            <div className={` ${isFullScreen ? 'fullscreen' : 'fullscreen-container'}`}>

                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="success" />
                    </div>
                ) : (
                    elements && (

                        <div className="mb-3">
                            <Row className="g-3">
                                <Col md={12} lg={12}>

                                    <div className="mt-3">
                                        {selectedNodes && Array.isArray(selectedNodes) && selectedNodes.length > 0 ? (
                                            <Alert variant="warning" className="d-flex flex-column py-1">
                                                <div className="mb-2">
                                                    <strong>Selected Node:</strong>
                                                </div>
                                                {/* Use a flex container to wrap the nodes */}
                                                <div className="d-flex flex-wrap">
                                                    {selectedNodes.map((node) => (
                                                        <div key={node.id} className="d-flex align-items-center me-2 mb-2" style={{ flex: '0 1 auto' }}>
                                                            {/* The label for the node */}
                                                            <div className="me-2">{node.label}</div>
                                                            {/* Delete icon */}
                                                            <FaTimes
                                                                onClick={() => this.handleUnselect(node.id)} // Handle unselect
                                                                className="cursor-pointer"
                                                                style={{ fontSize: '1.2rem', color: 'red', cursor: "pointer", marginTop: "-5px" }}
                                                                title="Unselect"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Alert>
                                        ) : (
                                            <div></div> // Optional: Show a message if no nodes are selected
                                        )}
                                    </div>
                                    <Card className="shadow-lg rounded">
                                        <Card.Body style={{ padding: '15px' }}>
                                            <div
                                                className="graph-container"
                                                style={{
                                                    position: 'relative',
                                                    width: '100%', // Ensure it takes up full width of the card
                                                    height: '700px', // Set a fixed height, or use a dynamic one if needed
                                                    margin: '0', // Remove default margins around the graph
                                                    overflow: 'hidden', // Prevent the graph from overflowing
                                                }}
                                            >
                                                <Row className="mb-3">
                                                    <Col>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <Form.Select value={layout} onChange={this.handleLayoutChange} aria-label="Layout" style={{ width: '200px' }}>
                                                                <option value="default">Default</option>
                                                                <option value="circular">Circular</option>
                                                                <option value="grid">Grid</option>
                                                                <option value="random">Random</option>
                                                                <option value="radial">Radial</option>
                                                            </Form.Select>

                                                            {this.state.visibleNodesPercentage < 101 ? (
                                                                <Button
                                                                    variant="primary"
                                                                    onClick={this.handleLoadMore}
                                                                    disabled={this.state.visibleNodesPercentage === 100}
                                                                >
                                                                    Load More Nodes({this.state.visibleNodesPercentage + 25}%)
                                                                </Button>
                                                            ) : null}
                                                        </div>
                                                    </Col>

                                                </Row>
                                                <ForceGraph3D
                                                    ref={this.fgRef}
                                                    graphData={elements}
                                                    nodeLabel={(node) => `${node.label}`}
                                                    nodeAutoColorBy="group"
                                                    cameraPosition={{ x: 0, y: 0, z: 10 }}
                                                    backgroundColor="#111827"
                                                    width='100%'
                                                    height={700}
                                                    linkWidth={1}
                                                    linkLabel="label"
                                                    // cooldownTicks={10}
                                                    // cooldownTime={150000}
                                                    linkDirectionalParticles={(link) => (link.showParticles ? 4 : 0)} // Conditional particles
                                                    linkDirectionalParticleSpeed={0.005}  // Slow down the particles
                                                    linkDirectionalParticleColor={() => 'red'}
                                                    linkDirectionalParticleWidth={6}
                                                    linkHoverPrecision={10}
                                                    onLinkClick={(link) => this.fgRef.current.emitParticle(link)}
                                                    linkDistance={100}
                                                    nodeRelSize={5}
                                                    nodeOpacity={1}
                                                    onNodeHover={this.handleNodeHover}
                                                    onNodeClick={this.handleClick}
                                                    onNodeDrag={(node) => {
                                                        node.fx = node.x;
                                                        node.fy = node.y;
                                                        node.fz = node.z;
                                                    }}
                                                    onNodeDragEnd={(node) => {
                                                        node.fx = node.x;
                                                        node.fy = node.y;
                                                        node.fz = node.z;
                                                    }}
                                                    nodeThreeObject={this.nodeThreeObject}
                                                />

                                            </div>
                                            {hoveredNode && (
                                                <div
                                                    className="hover-details"
                                                >
                                                    <Card style={{ width: '18rem', boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)', border: 'none' }}>
                                                        <Card.Body style={{ borderLeft: '5px solid blue' }}>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Name:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>
                                                                    {hoveredNode.label}
                                                                </span>
                                                            </Card.Text>
                                                            <Card.Text style={{ fontSize: '14px', marginBottom: '8px' }}>
                                                                <span style={{ fontWeight: 'bold', color: '#6c757d', display: 'inline-block' }}>
                                                                    Group:
                                                                </span>
                                                                <span style={{ color: '#000', fontWeight: 'normal', marginLeft: '10px' }}>
                                                                    {hoveredNode.group}
                                                                </span>
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
                    )
                )}

            </div>
        );
    }
}

export default ResultGraph;
