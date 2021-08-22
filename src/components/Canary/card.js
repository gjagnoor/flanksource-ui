import React from "react";
import { Title } from "./data";
import StatusList from "./status";
import { classNames } from "./utils";

export class CanaryCards extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ul className={`mt-1 grid grid-cols-1 gap-1 sm:gap-2 `}>
        {this.props.checks.map((check) => (
          <li
            key={check.key}
            className="col-span-1 flex shadow-sm rounded-md  rounded-l-md border-l border-t border-b border-gray-200 "
          >
            <div
              className="flex-1 flex pl-3 items-center cursor-pointer justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate  "
              onClick={() => this.props.onClick(check)}
            >
              <div className="flex-1 py-2 text-sm ">
                <span className="text-gray-900 font-medium hover:text-gray-600 truncate">
                  <Title check={check} />
                </span>
                <div className="float-right mr-2">
                  <StatusList check={check} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}