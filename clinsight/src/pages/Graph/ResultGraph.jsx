import React, { Component } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { getGraphData } from '../../api/graph';
import * as THREE from 'three';
import { Button, Dropdown, Form, Spinner, Row, Col, Card } from 'react-bootstrap';

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
        this.getGraphDataDetails();
    }

    // toggleFullScreen = () => {
    //     this.setState((prevState) => ({
    //         isFullScreen: !prevState.isFullScreen,
    //         parentWidth: prevState.isFullScreen ? 600 : window.innerWidth,
    //         parentHeight: prevState.isFullScreen ? 500 : window.innerHeight,
    //     }));
    // };

    handleNodeHover = (node) => {
        const { elements } = this.state;
        const hoveredNode = elements.nodes.find((n) => n.id === node.id);
        if (hoveredNode) {
            hoveredNode.hovered = !hoveredNode.hovered;
            this.setState({ elements });
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
        const updatedItems = [{ id: node.id, source_name: node.label, extra_data: node.extra_data, key: 'key' }];
        this.setState({ sourceNames: updatedItems });
        this.handleGraphClick(updatedItems);

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

    handleGraphClick = (newValue) => {
        this.props.onClick(newValue);
    };

    getGraphDataDetails = async () => {
        try {
            // if (this.props.data) {
            //     const updatedItems = this.props.data.source
            //         .filter((source) => source.selected)
            //         .map((source) => source.source_name);

            //     const postData = {
            //         id: this.props.data.id,
            //         doc: updatedItems,
            //     };

            // const response = await getGraphData(postData);
            const response = await getGraphData();
            this.setState({ elements: response, isLoading: false });
            // }
        } catch (error) {
            console.error('Error fetching graph data:', error);
            this.setState({ isLoading: false });
        }
    };

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
        if (prevState.layout !== this.state.layout) {
            this.applyLayout();
        }
    }

    render() {
        const { isFullScreen, parentWidth, parentHeight, elements, isLoading, layout } = this.state;

        return (
            <div className={` ${isFullScreen ? 'fullscreen' : 'fullscreen-container'}`}>

                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    elements && (

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
                                                    height: '700px', // Set a fixed height, or use a dynamic one if needed
                                                    margin: '0', // Remove default margins around the graph
                                                    overflow: 'hidden', // Prevent the graph from overflowing
                                                }}
                                            >
                                                <Row className="mb-3">
                                                    <Col>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            {/* <Button variant="outline-secondary" onClick={this.toggleFullScreen}>
                                Fullscreen
                            </Button> */}
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
                                                    nodeLabel={(node) => `${node.label}`}
                                                    nodeAutoColorBy="group"
                                                    cameraPosition={{ x: 0, y: 0, z: 10 }}
                                                    backgroundColor="#111827"
                                                    width='100%'
                                                    height={700}
                                                    linkWidth={1}
                                                    linkLabel="label"
                                                    cooldownTicks={10}
                                                    cooldownTime={150000}
                                                    linkDirectionalParticles={(link) => (link.showParticles ? 4 : 0)} // Conditional particles
                                                    linkDirectionalParticleSpeed={0.005}  // Slow down the particles
                                                    linkDirectionalParticleColor={() => 'red'}
                                                    linkDirectionalParticleWidth={6}
                                                    linkHoverPrecision={10}
                                                    onLinkClick={(link) => this.fgRef.current.emitParticle(link)}
                                                    linkDistance={100}
                                                    nodeRelSize={5}
                                                    nodeOpacity={1}
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
                                                /> </div>
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
