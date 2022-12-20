import { FaComment } from "react-icons/fa";
import {
  IncidentHistory,
  IncidentHistoryType
} from "../../api/services/IncidentsHistory";
import { hypothesisStatusIconMap } from "../../constants/hypothesisStatusOptions";
import { statusItems } from "../Incidents/data";

type IncidentHistoryItemTypeContentProps = {
  incidentHistory: IncidentHistory;
};

const IncidentHistoryTypeToComponentMap = new Map<
  `${IncidentHistoryType}`,
  React.FC<IncidentHistoryItemTypeContentProps>
>([
  [
    "incident.created",
    ({ incidentHistory }) => {
      const incident = incidentHistory.incident;

      return (
        <div className="normal-case">
          Created {incident?.description.toLowerCase()} incident
        </div>
      );
    }
  ],
  [
    "incident_status.updated",
    ({ incidentHistory }) => {
      const incident = incidentHistory.incident;

      return (
        <div className="normal-case">
          Updated {incident?.description.toLowerCase()} status to{" "}
          {incidentHistory.description?.toLocaleLowerCase()}
        </div>
      );
    }
  ],
  [
    "incident.status_updated",
    ({ incidentHistory }) => {
      const incident = incidentHistory.incident;

      const status =
        statusItems[incidentHistory.description as keyof typeof statusItems];

      return (
        <div className="flex flex-wrap items-center normal-case space-x-1">
          <span>Updated {incident?.description.toLowerCase()} status to</span>
          <span>{status.icon}</span>
          <span>{status.description.toLocaleLowerCase()}</span>
        </div>
      );
    }
  ],
  [
    "responder.created",
    ({ incidentHistory }) => {
      const responder = incidentHistory.responder;
      return <>Added {responder?.person?.name} as a responder</>;
    }
  ],
  [
    "evidence.created",
    ({ incidentHistory }) => {
      const evidence = incidentHistory.evidence;
      return <div>Added {evidence?.description} evidence</div>;
    }
  ],
  [
    "responder.commented",
    ({ incidentHistory }) => {
      const responder = incidentHistory.responder;
      const comment = incidentHistory.comment;

      return (
        <>
          <FaComment /> {comment?.comment} - {responder?.person?.name}{" "}
        </>
      );
    }
  ],
  [
    "hypothesis.created",
    ({ incidentHistory }) => {
      const hypothesis = incidentHistory.hypothesis;

      const status =
        incidentHistory.description as keyof typeof hypothesisStatusIconMap;
      const icon = hypothesisStatusIconMap[status];

      return (
        <>
          Added {hypothesis?.title} hypothesis, status is {icon}
          {incidentHistory.description}
        </>
      );
    }
  ],
  [
    "hypothesis.status_updated",
    ({ incidentHistory }) => {
      const hypothesis = incidentHistory.hypothesis;

      const status =
        incidentHistory.description as keyof typeof hypothesisStatusIconMap;

      const { Icon, className } = hypothesisStatusIconMap[status];

      return (
        <div className="flex flex-wrap items-center normal-case space-x-1">
          <span>{hypothesis?.title} hypothesis is</span>
          <span>
            <Icon className={`h-5 ${className}`} />
          </span>
          <span>{incidentHistory.description}</span>
        </div>
      );
    }
  ]
]);

export default function IncidentHistoryItemTypeContent({
  incidentHistory
}: IncidentHistoryItemTypeContentProps) {
  const { type } = incidentHistory;

  const Component = IncidentHistoryTypeToComponentMap.get(type);

  if (Component) {
    return <Component incidentHistory={incidentHistory} />;
  }

  return null;
}
