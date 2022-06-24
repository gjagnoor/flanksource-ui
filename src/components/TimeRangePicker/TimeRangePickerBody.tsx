import clsx from "clsx";
import { memo, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { TimeRangeList } from "./TimeRangeList";
import { storage, convertRangeValue } from "./helpers";
import { RecentlyRanges } from "./RecentlyRanges";
import { displayTimeFormat, RangeOption } from "./rangeOptions";
import { TimePickerCalendar } from "./TimePickerCalendar";
import { TimePickerInput } from "./TimePickerInput";

type TimeRangePickerBodyProps = {
  isOpen: any;
  closePicker: any;
  currentRange: any;
  changeRangeValue: any;
  pickerRef: any;
};

const TimeRangePickerBodyFC = ({
  isOpen,
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {},
  pickerRef
}: TimeRangePickerBodyProps) => {
  const [recentRanges, setRecentRanges] = useState(
    storage.getItem("timePickerRanges") || []
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState<Date>(new Date());
  const [inputValueFrom, setInputValueFrom] = useState(currentRange.from);
  const [inputValueTo, setInputValueTo] = useState(currentRange.to);
  const [valueType, setValueType] = useState<"from" | "to">();
  const [fromInputValueError, setFromInputValueError] = useState<string>();
  const [toInputValueError, setToInputValueError] = useState<string>();
  const [focusFromInput, setFocusFromInput] = useState<boolean>(true);
  const [focusToInput, setFocusToInput] = useState<boolean>();

  const changeRecentRangesList = useCallback(
    (range: RangeOption) => {
      if (
        !recentRanges.find(
          (el: RangeOption) =>
            dayjs(el.from).toISOString() === dayjs(range.from).toISOString() &&
            dayjs(el.to).toISOString() === dayjs(range.to).toISOString()
        )
      ) {
        let newRanges;
        if (recentRanges.length < 4) {
          newRanges = [range, ...recentRanges];
        } else {
          newRanges = [range, ...recentRanges.slice(0, 3)];
        }
        setRecentRanges([...newRanges]);
        storage.setItem("timePickerRanges", newRanges);
      }
    },
    [recentRanges]
  );

  const onChangeCalendarValue = (value: Date) => {
    if (valueType === "from") {
      const from = dayjs(value).format(displayTimeFormat);
      setInputValueFrom(from);
      setInputValueTo(dayjs(inputValueTo).isValid() ? inputValueTo : "");
      setFromInputValueError("");
      setFocusToInput(true);
      setFocusFromInput(false);
    } else if (valueType === "to") {
      const to = dayjs(value).format(displayTimeFormat);
      setInputValueTo(to);
      setInputValueFrom(dayjs(inputValueFrom).isValid() ? inputValueFrom : "");
      setToInputValueError("");
      setFocusFromInput(true);
      setFocusToInput(false);
    }
    setCalendarValue(value);
    setShowCalendar(false);
  };

  const applyTimeRange = useCallback(
    (range: RangeOption) => {
      changeRangeValue(range);
      if (dayjs(range.from).isValid() && dayjs(range.to).isValid()) {
        changeRecentRangesList({
          from: dayjs(range.from).toISOString(),
          to: dayjs(range.to).toISOString()
        });
        setShowCalendar(false);
        closePicker();
        setFocusFromInput(true);
        setFocusToInput(false);
      } else {
        setFromInputValueError(!range.from ? "Please provide value" : "");
        setToInputValueError(!range.to ? "Please provide value" : "");
      }
    },
    [changeRangeValue, changeRecentRangesList, closePicker]
  );

  const confirmValidRange = useCallback(
    (range: RangeOption) => {
      applyTimeRange(range);
    },
    [applyTimeRange]
  );

  const onShowCalendar = (calendarFor: "from" | "to") => {
    setValueType(calendarFor);
    setShowCalendar((val) => !val);
    if (calendarFor === "from" && dayjs(inputValueFrom).isValid()) {
      setCalendarValue(convertRangeValue(inputValueFrom, "jsDate") as Date);
    } else if (calendarFor === "to" && dayjs(inputValueTo).isValid()) {
      setCalendarValue(convertRangeValue(inputValueTo, "jsDate") as Date);
    }
  };

  useEffect(() => {
    setInputValueFrom(currentRange.from);
    setInputValueTo(currentRange.to);
  }, [currentRange]);

  const pickerLeft = pickerRef?.current?.getBoundingClientRect()?.left || 0;

  return (
    <div
      className={clsx(
        "absolute right-0 mt-2 flex cursor-auto w-full max-h-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 shadow-lg shadow-gray-200",
        { "invisible opacity-0": !isOpen, "right-0": pickerLeft > 600 }
      )}
    >
      <div
        className={clsx(
          "absolute shadow-lg shadow-gray-200",
          {
            calendarRight: pickerLeft < 300
          },
          showCalendar && isOpen ? "" : "invisible opacity-0"
        )}
      >
        <TimePickerCalendar
          calendarValue={calendarValue}
          onChange={onChangeCalendarValue as any}
          setShowCalendar={setShowCalendar}
        />
      </div>
      <div className="border-r border-gray-300 w-3.5/6 overflow-hidden">
        <div className="p-3">
          <div className="text-gray-500 text-base sm:space-x-2 whitespace-nowrap font-semibold">
            Absolute time range
          </div>
          <div>
            <div className="mb-2">
              <div className="my-3">
                <div className="text-sm font-medium sm:space-x-2 whitespace-nowrap mb-1">
                  From
                </div>
                <TimePickerInput
                  inputValue={inputValueFrom}
                  setInputValue={setInputValueFrom}
                  showCalendar={() => {
                    onShowCalendar("from");
                  }}
                  error={fromInputValueError}
                  focus={focusFromInput}
                />
              </div>
              <div className="my-3">
                <div className="text-sm font-medium sm:space-x-2 whitespace-nowrap mb-1">
                  To
                </div>
                <TimePickerInput
                  inputValue={inputValueTo}
                  setInputValue={setInputValueTo}
                  showCalendar={() => {
                    onShowCalendar("to");
                  }}
                  error={toInputValueError}
                  focus={focusToInput}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() =>
                  confirmValidRange({
                    from: inputValueFrom as string,
                    to: inputValueTo as string
                  })
                }
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <RecentlyRanges
          recentRanges={recentRanges}
          applyTimeRange={applyTimeRange}
        />
      </div>
      <div className="w-2.5/6 overflow-y-hidden">
        <TimeRangeList
          className="overflow-y-auto h-full"
          closePicker={closePicker}
          currentRange={currentRange}
          changeRangeValue={changeRangeValue}
          setShowCalendar={setShowCalendar}
        />
      </div>
    </div>
  );
};

export const TimeRangePickerBody = memo(TimeRangePickerBodyFC);