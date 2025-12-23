"use client";

import { useEffect, useState } from "react";
import ReactFlow, { Controls, Background} from "reactflow";
import { elements } from "./data/elements";
import { logic } from "./data/rules";
import { flowNodes } from "./data/flowMap";

export default function Flow() {
    const [answers, setAnswers] = useState<any>({});
    const [ ended, setEnded] = useState(false);
    const [currentNode, setCurrentNode] =useState("start");

    const [node, setNode] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    useEffect(() => {
        const tempNodes: any[]=[];
        const tempEdgess: any[]=[];
        let y=60;

        flowNodes.forEach((n) => {
            tempNodes.push({
                id: n.id,
                position: { x:100, y},
                data: {label: n.label}
            })
        })
    })
}