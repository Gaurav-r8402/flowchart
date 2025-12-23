"use client";

import { useEffect, useState } from "react";
import ReactFlow, { Controls, Background} from "reactflow";
import { elements } from "./data/elements";
import { logicRules } from "./data/rules";
import { flowNodes } from "./data/flowMap";

export default function Flow() {
    const [answers, setAnswers] = useState<any>({});
    const [ ended, setEnded] = useState(false);
    const [currentNode, setCurrentNode] =useState("start");

    const [node, setNode] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    useEffect(() => {
        const tempNodes: any[]=[];
        const tempEdges: any[]=[];
        let y=60;

        flowNodes.forEach((n) => {
            tempNodes.push({
                id: n.id,
                position: { x:100, y},
                data: {label: n.label},
                style: {
                    padding:12,
                    borderRadius: 10,
                    border: "2px solid black",
                    background : currentNode === n.id
                                 ? "#c7ffd8"
                                 : n.id === "end"
                                 ? "#ffb3b3"
                                 : n.id === "start"
                                 ? "#b3e6ff"
                                 : "#fff"
                }
            });

            if(n.next) {
                tempEdges.push({
                    id: `${n.id}-${n.next}`,
                    source: n.id,
                    target: n.next
                });
            }
            y+=130;
        });

        setNode(tempNodes);
        setEdges(tempEdges);
    },[currentNode]);


    const applyLogic = (fileId: string, value: string) => {
        const rules= logicRules.rules;

        for(const rule of rules) {
            if(rule.IF === fileId && rule.STATE === "isEqualTo" && rule.VALUE === value) {
                if(rule.DO === "endDurvey") {
                    setEnded(true);
                    setCurrentNode("end");
                }

                if(rule.DO === "showField") {
                    setCurrentNode(rule.FIELD as string);
                }
            }
        }
    };

    const handleSelect = (key: string, value: string, fileId: string) => {
        const updated = {...answers, [key]: value};
        setAnswers(updated);
        setCurrentNode(fileId);
        applyLogic(fileId,value);
    };


    return (
        <div className="flex h-screen">
            <div className="w-2/3 border-r">
                <ReactFlow nodes={node} edges={edges} >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>

            <div className="w-1/3 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Dynmaic Flow Form</h1>
                {ended ? (
                    <div className="text-red-600 text-xl">
                        Survey Ended
                    </div>
                ):(
                    <>
                        {elements.map((field) => {
                            if(field.type === "SelectField") {
                                return (
                                    <div key={field.id} className="mb-2">
                                        <label className="font-semibold block mb-1">{field.extraAttributes.label}</label>
                                        <select className="border p-2 rounded w-full" onChange={(e) => handleSelect(field.key, e.target.value, field.id)}>
                                            <option value="">Select</option>
                                            {field.extraAttributes.options?.map((o: any) => {
                                                return (
                                                    <option key={o.id} value={o.label}>
                                                    {o.label}
                                                </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                );
                            }

                            if(field.type === "TextField") {
                                if(answers["dad"] !== "yes") return null;
                                return (
                                    <div key={field.id} className="mb-4">
                                        <label className="font-semibold block mb-2">
                                            {field.extraAttributes.label}
                                        </label>
                                        <input type="text" className="border p-2 rounded w-full"/>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </>
                )}
            </div>
        </div>
    )
}