import { filter } from "lodash";
import qs from "qs";
import {
  BsFillHandThumbsUpFill,
  BsFillHandThumbsDownFill
} from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getTopology } from "../api/services/topology";
import { Dropdown } from "../components/Dropdown";
import { SearchLayout } from "../components/Layout";
import { Loading } from "../components/Loading";
import { toastError } from "../components/Toast/toast";
import { TopologyCard } from "../components/Topology";
import { TopologyBreadcrumbs } from "../components/Topology/topology-breadcrumbs";

import topData from "../data/sampleTopologyData.json";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";

export const healthTypes = [
  {
    icon: <AiOutlineStop />,
    description: "None",
    value: "none"
  },
  {
    icon: <BsFillHandThumbsUpFill style={{ color: "#1db31d" }} />,
    description: "Healthy",
    value: "healthy"
  },
  {
    icon: <BsFillHandThumbsDownFill style={{ color: "#fd3838" }} />,
    description: "Unhealthy",
    value: "unhealthy"
  }
];

const mockLabels = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

const labels = [...mockLabels];

const labelDropdownStyles = {
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: "nowrap"
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "14px"
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: "12px"
  }),
  container: (provided) => ({
    ...provided,
    minWidth: "300px"
  })
};

export function TopologyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { control, getValues } = useForm({
    defaultValues: {
      health: searchParams.get("health") || healthTypes[0].value
    }
  });
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [topology, setTopology] = useState(null);
  const [root, setRoot] = useState(null);
  const { id } = useParams();
  const load = () => {
    setIsLoading(true);
    const params = qs.parse(searchParams.toString());
    if (id != null) {
      params.id = id;
    }

    /// temp start
    const topology = filter(
      topData,
      (i) => (i.name != null || i.title != null) && i.type !== "summary"
    );
    setTopology(topology);

    console.log("top", topology);
    setIsLoading(false);
    // temp end

    // getTopology(params)
    //   .then((res) => {
    //     setIsLoading(false);

    //     if (res == null) {
    //       return null;
    //     }

    //     if (res.error != null) {
    //       toastError(res.error);
    //       return null;
    //     }

    //     const topology = filter(
    //       res.data,
    //       (i) => (i.name != null || i.title != null) && i.type !== "summary"
    //     );
    //     setTopology(topology);
    //   })
    //   .catch((e) => {
    //     setIsLoading(false);
    //     toastError(e);
    //   });
  };
  useEffect(() => {
    if (topology != null) {
      setRoot(topology.find((i) => i.id === id));
    }
  }, [topology, id]);
  useEffect(load, [id, searchParams]);

  const handleLabelChange = (labels) => {
    console.log("l", labels);
  };

  return (
    <SearchLayout
      title={
        <div className="flex text-xl text-gray-400  ">
          <Link to="/topology" className="hover:text-gray-500 ">
            Topology
          </Link>
          <TopologyBreadcrumbs topology={root} depth={3} />
        </div>
      }
      extra={
        <>
          <div className="flex items-center mr-4">
            <div className="mr-3 text-gray-500 text-sm">Health</div>
            <Dropdown
              control={control}
              name="health"
              className="w-36 mr-2 flex-shrink-0"
              items={healthTypes}
            />
          </div>
          <div className="flex items-center">
            <div className="mr-3 text-gray-500 text-sm">Label</div>
            <MultiSelectDropdown
              styles={labelDropdownStyles}
              className="w-full"
              options={labels}
              onChange={(labels) => handleLabelChange(labels)}
            />
          </div>
        </>
      }
    >
      {isLoading || topology === null ? (
        <Loading text="Loading topology..." />
      ) : (
        <div className="flex leading-1.21rel">
          <div className="flex flex-wrap">
            {topology.map((item) => (
              <TopologyCard key={item.id} topology={item} size="medium" />
            ))}
          </div>
        </div>
      )}
    </SearchLayout>
  );
}
