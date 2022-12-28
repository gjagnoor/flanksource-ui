import { AiOutlineTeam } from "react-icons/ai";
import { useGetComponentsTeamQuery } from "../../api/query-hooks";
import Title from "../Title/title";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";
import EmptyState from "../EmptyState";
import { Icon } from "../Icon";
import { Link } from "react-router-dom";

type Props = {
  componentId: string;
};

export function ComponentTeams({ componentId }: Props) {
  const { data: componentTeams, isLoading } =
    useGetComponentsTeamQuery(componentId);

  return (
    <CollapsiblePanel
      Header={
        <Title title="Teams" icon={<AiOutlineTeam className="w-6 h-auto" />} />
      }
    >
      <div className="flex flex-col space-y-4 py-2 w-full">
        {isLoading ? (
          <Loading />
        ) : componentTeams && componentTeams.length > 0 ? (
          componentTeams.map((team) => (
            <Link
              to={{
                pathname: `/settings/teams/${team.team_id}`
              }}
            >
              <div
                className="flex flex-row w-full space-x-2 px-2"
                key={team.team_id}
              >
                <Icon className="w-auto h-5" name={team.team.icon} />
                <div className="flex-1">{team.team.name}</div>
              </div>
            </Link>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </CollapsiblePanel>
  );
}
