import { IncidentHistory } from "../../api/services/IncidentsHistory";
import { relativeDateTime } from "../../utils/date";
import { Avatar } from "../Avatar";
import IncidentHistoryItemTypeContent from "./IncidentHistoryItemTypeContent";

type IncidentChangelogItemProps = {
  history: IncidentHistory;
};

export default function IncidentChangelogItem({
  history
}: IncidentChangelogItemProps) {
  return (
    <li className="flex flex-row items-center space-x-3" key={history.id}>
      <Avatar user={history.created_by} />
      <div className="min-w-0 flex-1 pt-1.5 flex items-center justify-between space-x-4">
        <div className="text-gray-500">
          <IncidentHistoryItemTypeContent incidentHistory={history} />
        </div>
        <div className="text-right items-center whitespace-nowrap text-gray-500">
          <time dateTime={history.created_at}>
            {relativeDateTime(history.created_at)}
          </time>
        </div>
      </div>
    </li>
  );
}
