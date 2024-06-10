'use client';

import { Container } from '@mantine/core';
import React, { useCallback } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState, Handle, Position, Node, Edge, Connection } from 'reactflow';
import classes from './ArchitectureFlowChart.module.css';

type CustomNodeData = {
    label: string;
    hideLeftHandle?: boolean;
    hideRightHandle?: boolean;
};

const initialNodes: Node<CustomNodeData>[] = [
    { id: 'webApp', type: 'inputNode', position: { x: 0, y: 200 }, data: { label: 'Web App (Next.js)', hideLeftHandle: true } },
    { id: 'gateway', type: 'inputNode', position: { x: 200, y: 200 }, data: { label: 'Gateway Service (.NET Backend)' } },
    { id: 'identityService', type: 'inputNode', position: { x: 600, y: 0 }, data: { label: 'Identity Service\n(Postgres DB)', hideRightHandle: true } },
    { id: 'auctionService', type: 'inputNode', position: { x: 600, y: 100 }, data: { label: 'Auction Service\n(Postgres DB)' } },
    { id: 'searchService', type: 'inputNode', position: { x: 600, y: 200 }, data: { label: 'Search Service\n(Mongo DB)' } },
    { id: 'biddingService', type: 'inputNode', position: { x: 600, y: 300 }, data: { label: 'Bidding Service\n(Mongo DB)' } },
    { id: 'notificationService', type: 'inputNode', position: { x: 600, y: 400 }, data: { label: 'Notification Service\n(SignalR)' } },
    { id: 'eventBus', type: 'bigNode', position: { x: 1000, y: 100 }, data: { label: 'RabbitMQ Event Bus' }, style: { width: 100, height: 400 } }
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'webApp', target: 'gateway', sourceHandle: 'a', targetHandle: 'b2', animated: true },
    { id: 'e2', source: 'gateway', target: 'identityService', sourceHandle: 'a', targetHandle: 'b3', animated: true },
    { id: 'e3', source: 'gateway', target: 'auctionService', sourceHandle: 'a', targetHandle: 'b4', animated: true },
    { id: 'e4', source: 'gateway', target: 'searchService', sourceHandle: 'a', targetHandle: 'b5', animated: true },
    { id: 'e5', source: 'gateway', target: 'biddingService', sourceHandle: 'a', targetHandle: 'b6', animated: true },
    { id: 'e6', source: 'gateway', target: 'notificationService', sourceHandle: 'a', targetHandle: 'b7', animated: true },
    { id: 'e7', source: 'auctionService', target: 'eventBus', sourceHandle: 'a', targetHandle: 'b9', animated: true },
    { id: 'e8', source: 'searchService', target: 'eventBus', sourceHandle: 'a', targetHandle: 'b10', animated: true },
    { id: 'e9', source: 'biddingService', target: 'eventBus', sourceHandle: 'a', targetHandle: 'b11', animated: true },
    { id: 'e10', source: 'notificationService', target: 'eventBus', sourceHandle: 'a', targetHandle: 'b12', animated: true }
];

// Custom node with ports on the left and right
const InputNode = ({ data }: { data: CustomNodeData }) => (
    <div style={{ padding: 10, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 5 }}>
        {!data.hideRightHandle && <Handle type="source" position={Position.Right} id="a" />}
        <div className={classes.label}>{data.label}</div>
        {!data.hideLeftHandle && <Handle type="target" position={Position.Left} id="b1" />}
    </div>
);

const BigNode = ({ data }: { data: CustomNodeData }) => (
    <div style={{ padding: 10, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 5, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Handle type="target" position={Position.Left} id="b9" style={{ top: 50 }} />
        <Handle type="target" position={Position.Left} id="b10" style={{ top: 150 }} />
        <Handle type="target" position={Position.Left} id="b11" style={{ top: 250 }} />
        <Handle type="target" position={Position.Left} id="b12" style={{ top: 350 }} />
        <div className={classes.verticalText}>{data.label}</div>
    </div>
);

const nodeTypes = {
    inputNode: InputNode,
    bigNode: BigNode
};

export default function ArchitectureFlowChart() {
    const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // @ts-ignore
    return (
        <Container fluid h={1080}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView={true}
                nodesConnectable={false}
                proOptions={{ hideAttribution: true }}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </Container>
    );
}
