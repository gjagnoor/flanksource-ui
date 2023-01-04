import { useMemo } from "react";
import { FaTags } from "react-icons/fa";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import CollapsiblePanel from "../CollapsiblePanel";
import { DescriptionCard } from "../DescriptionCard";
import { InfoMessage } from "../InfoMessage";
import { Loading } from "../Loading";
import Title from "../Title/title";

type Props = {
  configId: string;
};

export function ConfigDetails({ configId }: Props) {
  const {
    data: configDetails,
    isLoading,
    error
  } = useGetConfigByIdQuery(configId);

  const displayDetails = useMemo(() => {
    if (configDetails) {
      return [
        {
          label: "Name",
          value: configDetails.name
        },
        ...(configDetails.tags
          ? Object.entries(configDetails.tags)
              .filter(([key]) => key !== "Name")
              .map(([key, value]) => ({
                label: key,
                value
              }))
          : [])
      ];
    }
  }, [configDetails]);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex py-2 flex-row flex-1 items-center">
          <Title title="Tags" icon={<FaTags className="w-6 h-auto" />} />
        </div>
      }
    >
      <div className="flex flex-col space-y-2 py-2 max-w-full">
        {isLoading && <Loading />}
        {displayDetails && !error ? (
          <DescriptionCard items={displayDetails} />
        ) : (
          <InfoMessage message="Details not found" />
        )}
      </div>
    </CollapsiblePanel>
  );
}