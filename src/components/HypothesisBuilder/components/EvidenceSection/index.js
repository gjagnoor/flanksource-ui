import React from "react";

export function EvidenceSection({
  tree,
  setTree,
  currentNode,
  nodePath,
  titlePrepend,
  onButtonClick,
  ...rest
}) {
  const { evidences, id: nodeId } = currentNode;
  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="">{titlePrepend}</div>
        <button
          type="button"
          onClick={onButtonClick}
          className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add evidence
        </button>
      </div>
      <div className="border mt-2">
        {evidences && evidences.length > 0 ? (
          evidences.map((evidence) => <div key={evidence}>{evidence}</div>)
        ) : (
          <div className="py-2 px-4 text-sm text-gray-400">No evidence</div>
        )}
      </div>
    </div>
  );
}