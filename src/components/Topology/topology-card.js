import React, { useEffect, useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Navigate, useNavigate } from "react-router-dom";
import { Icon } from "../Icon";
import { Property } from "./property";
import { HealthSummary } from "../HealthSummary/summary";
import { MetricsHeader } from "./metrics-header";
import { TopologyDropdownMenu } from "./topology-menu";
import { getTopology } from "../../api/services/topology";
import { Loading } from "../Loading";



export function TopologyCard({
  size,
  topology,
  topologyId,
  selectionMode,
  selected,
  onSelectionChange
}) {
  const [_topology, setTopology] = useState(topology);

  useEffect(() => {
    if (topologyId != null && _topology == null) {
      getTopology(topologyId).then((topology) => {
        setTopology(topology.data[0]);
      });
    }
  });

  let selectionModeRootProps = null;

  if (selectionMode) {
    selectionModeRootProps = {
      role: "button",
      onClick: (state, event) => {
        onSelectionChange(state, event);
      }
    };
  }

  if (_topology == null) {
    return <Loading text={`Loading ${topologyId}`} />;
  }


  return (
    <div
      className={clsx(
        "rounded-8px mb-4 shadow-card card bg-white topology-card w-med-card",
        _topology.status,
        selectionMode ? "cursor-pointer" : ""
      )}
      {...selectionModeRootProps}
    >
      <div className="flex flex-row flex-nowrap rounded-t-8px bg-white">
        <div className="flex pr-1 pt-2.5 pb-3.5 pl-5">
          <div className="text-gray-color m-auto mr-2.5 flex-initial max-w-1/4 leading-1.21rel">
            <h3 className="text-gray-color text-2xsi leading-1.21rel">
              <Icon name={_topology.icon} size="2xl" />
            </h3>
          </div>
          <div className="flex-1 m-auto overflow-hidden">
            <p
              className="font-bold overflow-hidden truncate align-middle text-15pxinrem leading-1.21rel"
              title={_topology.name}
            >
              {_topology.name}
            </p>
            {_topology.description != null && (
              <h3 className="text-gray-color overflow-hidden truncate text-2xsi leading-1.21rel font-medium">
                {_topology.description}
              </h3>
            )}
          </div>
        </div>

        <div className="flex ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
          <MetricsHeader
            items={[
              { name: "RPS:", value: "165/s" },
              { name: "Errors:", value: "0.1%" },
              { name: "Latency:", value: "225ms" },
            ]}
          />
        </div>

        <div className="flex  ml-auto pl-1 pr-1.5 pb-3.5 pt-3">
          {selectionMode === "select" ? (
            <div className="pr-1.5 pt-1 flex min-w-7 justify-end items-start">
              <input
                type="checkbox"
                className="h-4 w-4 text-dark-blue outline-none rounded-4px focus:outline-none"
                checked={selected}
                readOnly
              />
            </div>
          ) : (
            <TopologyDropdownMenu topology={_topology} />
          )}
        </div>
      </div>
      <div className="flex flex-nowrap bg-lightest-gray rounded-b-8px">
        <div className="w-med-card-left py-4 pl-5 pr-1 max-h-[100px] overflow-x-auto">
          {_topology.properties &&
            _topology.properties.map((property, index) => (
              <Property
                key={property.name}
                property={property}
                className={
                  index === _topology.properties.length - 1 ? "mb-0" : "mb-2.5"
                }
              />
            ))}
        </div>
        <div className="w-med-card-right pl-1 py-4 pr-5">
          {_topology.components &&
            _topology.components.map((component, index) => (
              <div
                className={
                  index === _topology.components.length - 1 ? "mb-0" : "mb-2.5"
                }
                key={component.id}
              >
                <HealthSummary component={component} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

TopologyCard.propTypes = {
  size: PropTypes.string,
  selectionMode: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  topologyId: PropTypes.string,
  topology: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    icon: PropTypes.string,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        text: PropTypes.string
      }).isRequired
    )
  })
};

TopologyCard.defaultProps = {
  selectionMode: false,
  selected: false,
  topology: null,
  topologyId: null,
  size: "md",
  onSelectionChange: () => { }
};